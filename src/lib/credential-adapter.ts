import { tryGetCurrentAuthEndpointContext } from '@better-auth/core/context';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { APIError, type BetterAuthOptions, type DBAdapter } from 'better-auth';
import { and, eq } from 'drizzle-orm';
import type { getDb } from '../db';
import * as tables from '../db/schema';

type Database = Awaited<ReturnType<typeof getDb>>;
type Transaction = Parameters<Parameters<Database['transaction']>[0]>[0];
type Credential = { id: string; userId: string; password: string };

const credentialsChanged = () =>
  new APIError('UNAUTHORIZED', {
    code: 'CREDENTIALS_CHANGED',
    message: 'Your credentials changed. Please sign in again.',
  });

/** Bind each password proof to its eventual write, across processes and recovery paths. */
export function credentialAdapter(database: Database) {
  // Endpoint contexts are request-local, including auth.api calls. Never cache a proof globally.
  const proofs = new WeakMap<object, Map<string, Credential>>();

  return (options: BetterAuthOptions): DBAdapter => {
    function remember(model: string, value: unknown) {
      const context = tryGetCurrentAuthEndpointContext();
      if (!context || !['/sign-in/email', '/change-password'].includes(context.path || '')) return;
      const record = value as { account?: unknown[] } | null;
      const accounts = model === 'user' ? record?.account : model === 'account' ? [value] : [];
      for (const value of accounts || []) {
        const account = value as Credential & { providerId: string; accountId: string };
        if (
          !account ||
          account.providerId !== 'credential' ||
          account.accountId !== account.userId ||
          typeof account.password !== 'string'
        )
          continue;
        let saved = proofs.get(context);
        if (!saved) proofs.set(context, (saved = new Map()));
        // Later reads must not replace the credential that was originally verified.
        if (!saved.has(account.userId))
          saved.set(account.userId, {
            id: account.id,
            userId: account.userId,
            password: account.password,
          });
      }
    }

    async function lockUser(tx: Transaction, userId: string, proof?: Credential) {
      // Recovery-code generation/redemption uses this same user-row lock.
      const [owner] = await tx
        .select({ id: tables.user.id })
        .from(tables.user)
        .where(eq(tables.user.id, userId))
        .for('update');
      if (!owner) throw credentialsChanged();
      if (proof) {
        const [current] = await tx
          .select({ id: tables.account.id, password: tables.account.password })
          .from(tables.account)
          .where(
            and(
              eq(tables.account.userId, userId),
              eq(tables.account.providerId, 'credential'),
              eq(tables.account.accountId, userId),
            ),
          );
        if (current?.id !== proof.id || current.password !== proof.password)
          throw credentialsChanged();
      }
    }

    function wrap(db: Database | Transaction): DBAdapter {
      const adapter = drizzleAdapter(db, { provider: 'pg', schema: tables, transaction: true })(
        options,
      );
      const { findOne, create } = adapter;
      const guarded: DBAdapter = {
        ...adapter,
        async findOne<T>(input: Parameters<DBAdapter['findOne']>[0]) {
          const result = await findOne<T>(input);
          remember(input.model, result);
          return result;
        },
        async create(input) {
          const context = tryGetCurrentAuthEndpointContext();
          if (input.model !== 'session' || context?.path !== '/sign-in/email') return create(input);
          const userId = input.data.userId;
          const proof = typeof userId === 'string' ? proofs.get(context)?.get(userId) : undefined;
          if (!proof) throw credentialsChanged();
          return db.transaction(async (tx) => {
            await lockUser(tx, proof.userId, proof);
            // The recheck and insert share the lock until commit. No check/insert gap.
            return drizzleAdapter(tx, { provider: 'pg', schema: tables, transaction: false })(
              options,
            ).create(input);
          });
        },
        async transaction(callback) {
          const context = tryGetCurrentAuthEndpointContext();
          return db.transaction(async (tx) => {
            if (context?.path === '/change-password') {
              const userId = context.context.session?.user.id;
              const proof = userId ? proofs.get(context)?.get(userId) : undefined;
              if (!proof) throw credentialsChanged();
              // Acquire before revoking sessions as well as before writing the password.
              await lockUser(tx, proof.userId, proof);
            } else if (context?.path === '/reset-password') {
              const token = context.body?.token || context.query?.token;
              if (typeof token !== 'string') throw credentialsChanged();
              const [verification] = await tx
                .select({ userId: tables.verification.value })
                .from(tables.verification)
                .where(eq(tables.verification.identifier, `reset-password:${token}`));
              if (!verification) throw credentialsChanged();
              // Email reset must serialize with sign-in too, before deleting sessions.
              await lockUser(tx, verification.userId);
            }
            return callback(wrap(tx));
          });
        },
      };
      // Preserve the registered adapter identity/schema checks and real-transaction
      // metadata, so Better Auth never runs after-commit hooks after a rollback.
      return Object.assign(adapter, guarded);
    }

    return wrap(database);
  };
}
