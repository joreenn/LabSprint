import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  bigint,
  jsonb,
  primaryKey,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import type { Appearance, PracticeSession, StudySettings } from '../lib/server/types';

const time = (name: string) => timestamp(name, { withTimezone: true });
export const user = pgTable('app_user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: time('created_at').notNull().defaultNow(),
  updatedAt: time('updated_at').notNull().defaultNow(),
});
export const session = pgTable(
  'auth_session',
  {
    id: text('id').primaryKey(),
    expiresAt: time('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: time('created_at').notNull().defaultNow(),
    updatedAt: time('updated_at').notNull().defaultNow(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (t) => [index('session_user_idx').on(t.userId)],
);
export const account = pgTable(
  'auth_account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: time('access_token_expires_at'),
    refreshTokenExpiresAt: time('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: time('created_at').notNull().defaultNow(),
    updatedAt: time('updated_at').notNull().defaultNow(),
  },
  (t) => [
    index('account_user_idx').on(t.userId),
    uniqueIndex('account_provider_idx').on(t.providerId, t.accountId),
  ],
);
export const verification = pgTable(
  'auth_verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: time('expires_at').notNull(),
    createdAt: time('created_at').notNull().defaultNow(),
    updatedAt: time('updated_at').notNull().defaultNow(),
  },
  (t) => [index('verification_identifier_idx').on(t.identifier)],
);
export const rateLimit = pgTable('auth_rate_limit', {
  id: text('id').primaryKey(),
  key: text('key').notNull().unique(),
  count: integer('count').notNull(),
  lastRequest: bigint('last_request', { mode: 'number' }).notNull(),
});
export const attempts = pgTable(
  'attempt',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    sessionId: text('session_id').notNull(),
    questionId: text('question_id').notNull(),
    optionId: text('option_id').notNull(),
    correct: boolean('correct').notNull(),
    questionVersion: integer('question_version').notNull(),
    createdAt: time('created_at').notNull().defaultNow(),
  },
  (t) => [
    index('attempt_user_idx').on(t.userId),
    uniqueIndex('attempt_session_question_idx').on(t.userId, t.sessionId, t.questionId),
  ],
);
export const bookmarks = pgTable(
  'bookmark',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    questionId: text('question_id').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.questionId] })],
);
export const reports = pgTable(
  'question_report',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    questionId: text('question_id').notNull(),
    reason: text('reason').notNull(),
    createdAt: time('created_at').notNull().defaultNow(),
  },
  (t) => [index('report_user_idx').on(t.userId)],
);
export const preferences = pgTable('study_preferences', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  settings: jsonb('settings').$type<StudySettings>().notNull(),
  appearance: jsonb('appearance').$type<Appearance | null>(),
  activeSession: jsonb('active_session').$type<PracticeSession | null>(),
  updatedAt: time('updated_at').notNull().defaultNow(),
});

export const recoveryCode = pgTable(
  'recovery_code',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    codeHash: text('code_hash').notNull().unique(),
    createdAt: time('created_at').notNull().defaultNow(),
    usedAt: time('used_at'),
  },
  (t) => [index('recovery_code_user_idx').on(t.userId)],
);

export const recoveryRateLimit = pgTable('recovery_rate_limit', {
  key: text('key').primaryKey(),
  count: integer('count').notNull(),
  windowStart: time('window_start').notNull().defaultNow(),
});
