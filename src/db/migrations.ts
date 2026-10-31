/** Add numbered migrations here; never rewrite a migration after deployment. */
export const migrations = [
  {
    version: 1,
    sql: `
CREATE TABLE IF NOT EXISTS app_user (
 id text PRIMARY KEY, name text NOT NULL, email text NOT NULL UNIQUE, email_verified boolean NOT NULL DEFAULT false,
 image text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS auth_session (
 id text PRIMARY KEY, expires_at timestamptz NOT NULL, token text NOT NULL UNIQUE,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), ip_address text, user_agent text,
 user_id text NOT NULL REFERENCES app_user(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS session_user_idx ON auth_session(user_id);
CREATE TABLE IF NOT EXISTS auth_account (
 id text PRIMARY KEY, account_id text NOT NULL, provider_id text NOT NULL, user_id text NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
 access_token text, refresh_token text, id_token text, access_token_expires_at timestamptz, refresh_token_expires_at timestamptz,
 scope text, password text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS account_user_idx ON auth_account(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS account_provider_idx ON auth_account(provider_id,account_id);
CREATE TABLE IF NOT EXISTS auth_verification (
 id text PRIMARY KEY, identifier text NOT NULL, value text NOT NULL, expires_at timestamptz NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS verification_identifier_idx ON auth_verification(identifier);
CREATE TABLE IF NOT EXISTS auth_rate_limit (
 id text PRIMARY KEY, key text NOT NULL UNIQUE, count integer NOT NULL, last_request bigint NOT NULL
);
CREATE TABLE IF NOT EXISTS attempt (
 id text PRIMARY KEY, user_id text NOT NULL REFERENCES app_user(id) ON DELETE CASCADE, session_id text NOT NULL,
 question_id text NOT NULL, option_id text NOT NULL, correct boolean NOT NULL, question_version integer NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS attempt_user_idx ON attempt(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS attempt_session_question_idx ON attempt(user_id,session_id,question_id);
CREATE TABLE IF NOT EXISTS bookmark (
 user_id text NOT NULL REFERENCES app_user(id) ON DELETE CASCADE, question_id text NOT NULL, PRIMARY KEY(user_id,question_id)
);
CREATE TABLE IF NOT EXISTS question_report (
 id text PRIMARY KEY, user_id text NOT NULL REFERENCES app_user(id) ON DELETE CASCADE, question_id text NOT NULL,
 reason text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS report_user_idx ON question_report(user_id);
CREATE TABLE IF NOT EXISTS study_preferences (
 user_id text PRIMARY KEY REFERENCES app_user(id) ON DELETE CASCADE, settings jsonb NOT NULL,
 active_session jsonb, updated_at timestamptz NOT NULL DEFAULT now()
);
`,
  },
  {
    version: 2,
    sql: `ALTER TABLE study_preferences ADD COLUMN IF NOT EXISTS appearance jsonb;`,
  },
  {
    version: 3,
    sql: `
CREATE TABLE IF NOT EXISTS recovery_code (
 id text PRIMARY KEY, user_id text NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
 code_hash text NOT NULL UNIQUE, created_at timestamptz NOT NULL DEFAULT now(), used_at timestamptz
);
CREATE INDEX IF NOT EXISTS recovery_code_user_idx ON recovery_code(user_id);
CREATE TABLE IF NOT EXISTS recovery_rate_limit (
 key text PRIMARY KEY, count integer NOT NULL, window_start timestamptz NOT NULL DEFAULT now()
);
`,
  },
];
