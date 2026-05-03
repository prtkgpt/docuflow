-- MyPDFKitty demo seed data — self-contained.
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

CREATE TABLE IF NOT EXISTS "BlogPost" (
  "id"               TEXT PRIMARY KEY,
  "slug"             TEXT UNIQUE NOT NULL,
  "title"            TEXT NOT NULL,
  "description"      TEXT NOT NULL,
  "category"         TEXT NOT NULL DEFAULT 'PDF editing',
  "body"             TEXT NOT NULL,
  "answer"           TEXT,
  "primaryToolHref"  TEXT,
  "primaryToolLabel" TEXT,
  "relatedToolSlugs" TEXT,
  "faqJson"          TEXT,
  "published"        BOOLEAN NOT NULL DEFAULT FALSE,
  "publishedAt"      TIMESTAMP,
  "authorEmail"      TEXT,
  "createdAt"        TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"        TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS "BlogPost_pub_idx" ON "BlogPost"("published", "publishedAt");

------------------------------------------------------------------
-- Demo data
------------------------------------------------------------------

INSERT INTO "User" ("id", "name", "email", "image", "createdAt", "updatedAt")
VALUES
  ('user_demo_1', 'Demo User',  'demo@mypdfkitty.com',  NULL, NOW(), NOW()),
  ('user_demo_2', 'Pro Tester', 'pro@mypdfkitty.com',   NULL, NOW(), NOW())
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

-- AI metering tables (mirrored from schema.sql for self-contained seeding).
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "chatQuestionsCredits" INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS "PdfChunk" (
  "id"        TEXT PRIMARY KEY,
  "fileId"    TEXT NOT NULL REFERENCES "File"("id") ON DELETE CASCADE,
  "index"     INTEGER NOT NULL,
  "text"      TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE ("fileId", "index")
);
CREATE INDEX IF NOT EXISTS "PdfChunk_fileId_idx" ON "PdfChunk"("fileId");

CREATE TABLE IF NOT EXISTS "PdfSummary" (
  "id"            TEXT PRIMARY KEY,
  "fileId"        TEXT UNIQUE NOT NULL REFERENCES "File"("id") ON DELETE CASCADE,
  "short"         TEXT NOT NULL,
  "bullets"       TEXT NOT NULL,
  "takeaways"     TEXT NOT NULL,
  "actions"       TEXT NOT NULL,
  "model"         TEXT NOT NULL,
  "inputTokens"   INTEGER NOT NULL DEFAULT 0,
  "outputTokens"  INTEGER NOT NULL DEFAULT 0,
  "estimatedCost" DECIMAL(12, 6) NOT NULL DEFAULT 0,
  "createdAt"     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "AIUsage" (
  "id"            TEXT PRIMARY KEY,
  "userId"        TEXT REFERENCES "User"("id") ON DELETE SET NULL,
  "fileId"        TEXT REFERENCES "File"("id") ON DELETE SET NULL,
  "featureType"   TEXT NOT NULL,
  "model"         TEXT NOT NULL,
  "inputTokens"   INTEGER NOT NULL DEFAULT 0,
  "outputTokens"  INTEGER NOT NULL DEFAULT 0,
  "estimatedCost" DECIMAL(12, 6) NOT NULL DEFAULT 0,
  "createdAt"     TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS "AIUsage_userId_createdAt_idx" ON "AIUsage"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "AIUsage_fileId_idx" ON "AIUsage"("fileId");

CREATE TABLE IF NOT EXISTS "PlanUsage" (
  "id"                      TEXT PRIMARY KEY,
  "userId"                  TEXT UNIQUE NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "plan"                    TEXT NOT NULL,
  "filesUsed"               INTEGER NOT NULL DEFAULT 0,
  "summariesUsed"           INTEGER NOT NULL DEFAULT 0,
  "chatQuestionsUsed"       INTEGER NOT NULL DEFAULT 0,
  "inputTokensUsed"         INTEGER NOT NULL DEFAULT 0,
  "outputTokensUsed"        INTEGER NOT NULL DEFAULT 0,
  "estimatedCostMonthCents" INTEGER NOT NULL DEFAULT 0,
  "resetDate"               TIMESTAMP NOT NULL
);
