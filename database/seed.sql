-- DocuFlow demo seed data — self-contained.
-- Safe to run on its own: it creates any missing tables first, then inserts demo rows.
-- All inserts use ON CONFLICT DO NOTHING so re-running is idempotent.

------------------------------------------------------------------
-- Schema (mirrors database/schema.sql; CREATE IF NOT EXISTS)
------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "User" (
  "id"            TEXT PRIMARY KEY,
  "name"          TEXT,
  "email"         TEXT UNIQUE NOT NULL,
  "emailVerified" TIMESTAMP,
  "image"         TEXT,
  "createdAt"     TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Account" (
  "id"                TEXT PRIMARY KEY,
  "userId"            TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "type"              TEXT NOT NULL,
  "provider"          TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token"     TEXT,
  "access_token"      TEXT,
  "expires_at"        INTEGER,
  "token_type"        TEXT,
  "scope"             TEXT,
  "id_token"          TEXT,
  "session_state"     TEXT,
  UNIQUE ("provider", "providerAccountId")
);

CREATE TABLE IF NOT EXISTS "Session" (
  "id"           TEXT PRIMARY KEY,
  "sessionToken" TEXT UNIQUE NOT NULL,
  "userId"       TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "expires"      TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token"      TEXT UNIQUE NOT NULL,
  "expires"    TIMESTAMP NOT NULL,
  UNIQUE ("identifier", "token")
);

CREATE TABLE IF NOT EXISTS "File" (
  "id"           TEXT PRIMARY KEY,
  "userId"       TEXT REFERENCES "User"("id") ON DELETE CASCADE,
  "originalName" TEXT NOT NULL,
  "storedName"   TEXT NOT NULL,
  "mimeType"     TEXT NOT NULL,
  "size"         INTEGER NOT NULL,
  "url"          TEXT NOT NULL,
  "status"       TEXT NOT NULL DEFAULT 'ready',
  "createdAt"    TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"    TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS "File_userId_idx" ON "File"("userId");

CREATE TABLE IF NOT EXISTS "ProcessedFile" (
  "id"         TEXT PRIMARY KEY,
  "userId"     TEXT REFERENCES "User"("id") ON DELETE SET NULL,
  "fileId"     TEXT NOT NULL REFERENCES "File"("id") ON DELETE CASCADE,
  "toolType"   TEXT NOT NULL,
  "outputUrl"  TEXT NOT NULL,
  "outputSize" INTEGER NOT NULL,
  "createdAt"  TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS "ProcessedFile_userId_idx" ON "ProcessedFile"("userId");
CREATE INDEX IF NOT EXISTS "ProcessedFile_fileId_idx" ON "ProcessedFile"("fileId");

CREATE TABLE IF NOT EXISTS "ToolUsage" (
  "id"        TEXT PRIMARY KEY,
  "userId"    TEXT REFERENCES "User"("id") ON DELETE SET NULL,
  "toolType"  TEXT NOT NULL,
  "fileId"    TEXT REFERENCES "File"("id") ON DELETE SET NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS "ToolUsage_userId_idx" ON "ToolUsage"("userId");

CREATE TABLE IF NOT EXISTS "Subscription" (
  "id"                   TEXT PRIMARY KEY,
  "userId"               TEXT UNIQUE NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "plan"                 TEXT NOT NULL DEFAULT 'free',
  "stripeCustomerId"     TEXT,
  "stripeSubscriptionId" TEXT,
  "status"               TEXT NOT NULL DEFAULT 'active',
  "createdAt"            TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"            TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "AIRequest" (
  "id"          TEXT PRIMARY KEY,
  "userId"      TEXT REFERENCES "User"("id") ON DELETE SET NULL,
  "fileId"      TEXT REFERENCES "File"("id") ON DELETE SET NULL,
  "requestType" TEXT NOT NULL,
  "prompt"      TEXT NOT NULL,
  "response"    TEXT NOT NULL,
  "tokensUsed"  INTEGER NOT NULL DEFAULT 0,
  "createdAt"   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS "AIRequest_userId_idx" ON "AIRequest"("userId");

------------------------------------------------------------------
-- Demo data
------------------------------------------------------------------

INSERT INTO "User" ("id", "name", "email", "image", "createdAt", "updatedAt")
VALUES
  ('user_demo_1', 'Demo User',  'demo@docuflow.app',  NULL, NOW(), NOW()),
  ('user_demo_2', 'Pro Tester', 'pro@docuflow.app',   NULL, NOW(), NOW())
ON CONFLICT ("email") DO NOTHING;

INSERT INTO "Subscription" ("id", "userId", "plan", "status", "createdAt", "updatedAt")
VALUES
  ('sub_demo_1', 'user_demo_1', 'free', 'active', NOW(), NOW()),
  ('sub_demo_2', 'user_demo_2', 'pro',  'active', NOW(), NOW())
ON CONFLICT ("userId") DO NOTHING;

INSERT INTO "File" ("id", "userId", "originalName", "storedName", "mimeType", "size", "url", "status", "createdAt", "updatedAt")
VALUES
  ('file_demo_1', 'user_demo_1', 'invoice-march.pdf',     'demo/invoice-march.pdf',     'application/pdf', 184320,  '/uploads/demo/invoice-march.pdf',     'ready', NOW(), NOW()),
  ('file_demo_2', 'user_demo_1', 'lease-agreement.pdf',   'demo/lease-agreement.pdf',   'application/pdf', 1048576, '/uploads/demo/lease-agreement.pdf',   'ready', NOW(), NOW()),
  ('file_demo_3', 'user_demo_2', 'research-report.pdf',   'demo/research-report.pdf',   'application/pdf', 2621440, '/uploads/demo/research-report.pdf',   'ready', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProcessedFile" ("id", "userId", "fileId", "toolType", "outputUrl", "outputSize", "createdAt")
VALUES
  ('pf_demo_1', 'user_demo_1', 'file_demo_1', 'compress',     '/uploads/demo/invoice-march.compressed.pdf', 92160,  NOW()),
  ('pf_demo_2', 'user_demo_1', 'file_demo_2', 'split',        '/uploads/demo/lease-1-3.pdf',                524288, NOW()),
  ('pf_demo_3', 'user_demo_2', 'file_demo_3', 'summarize',    '/uploads/demo/research-summary.txt',         4096,   NOW())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ToolUsage" ("id", "userId", "toolType", "fileId", "createdAt")
VALUES
  ('tu_demo_1', 'user_demo_1', 'compress',  'file_demo_1', NOW()),
  ('tu_demo_2', 'user_demo_1', 'split',     'file_demo_2', NOW()),
  ('tu_demo_3', 'user_demo_2', 'summarize', 'file_demo_3', NOW()),
  ('tu_demo_4', 'user_demo_2', 'merge',     'file_demo_3', NOW())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "AIRequest" ("id", "userId", "fileId", "requestType", "prompt", "response", "tokensUsed", "createdAt")
VALUES
  ('ai_demo_1', 'user_demo_2', 'file_demo_3', 'summarize', 'Summarize the attached PDF.', 'This is a sample AI-generated summary used for demo purposes.', 320, NOW())
ON CONFLICT ("id") DO NOTHING;
