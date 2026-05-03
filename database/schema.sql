-- MyPDFKitty database schema for Neon PostgreSQL.
-- Paste this into the Neon SQL Editor as an alternative to running Prisma migrations.

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

-- AI cost / metering primitives -------------------------------------------

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

ALTER TABLE "PdfChunk" ADD COLUMN IF NOT EXISTS "embedding" TEXT;

-- Send-for-signature ("envelope") workflow ---------------------------------

CREATE TABLE IF NOT EXISTS "Envelope" (
  "id"           TEXT PRIMARY KEY,
  "userId"       TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "sourceFileId" TEXT NOT NULL,
  "signedFileId" TEXT,
  "subject"      TEXT NOT NULL,
  "message"      TEXT,
  "status"       TEXT NOT NULL DEFAULT 'draft',
  "createdAt"    TIMESTAMP NOT NULL DEFAULT NOW(),
  "sentAt"       TIMESTAMP,
  "completedAt"  TIMESTAMP,
  "deletedAt"    TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Envelope_userId_createdAt_idx" ON "Envelope"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "Envelope_status_idx" ON "Envelope"("status");

CREATE TABLE IF NOT EXISTS "EnvelopeRecipient" (
  "id"            TEXT PRIMARY KEY,
  "envelopeId"    TEXT NOT NULL REFERENCES "Envelope"("id") ON DELETE CASCADE,
  "name"          TEXT NOT NULL,
  "email"         TEXT NOT NULL,
  "order"         INTEGER NOT NULL DEFAULT 1,
  "status"        TEXT NOT NULL DEFAULT 'pending',
  "signingToken"  TEXT UNIQUE NOT NULL,
  "signedAt"      TIMESTAMP,
  "viewedAt"      TIMESTAMP,
  "declinedAt"    TIMESTAMP,
  "declineReason" TEXT,
  "signerIp"      TEXT,
  "signerUa"      TEXT,
  "remindedAt"    TIMESTAMP,
  "remindCount"   INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS "EnvelopeRecipient_envelopeId_idx" ON "EnvelopeRecipient"("envelopeId");
CREATE INDEX IF NOT EXISTS "EnvelopeRecipient_signingToken_idx" ON "EnvelopeRecipient"("signingToken");

CREATE TABLE IF NOT EXISTS "EnvelopeField" (
  "id"          TEXT PRIMARY KEY,
  "envelopeId"  TEXT NOT NULL REFERENCES "Envelope"("id") ON DELETE CASCADE,
  "recipientId" TEXT NOT NULL REFERENCES "EnvelopeRecipient"("id") ON DELETE CASCADE,
  "type"        TEXT NOT NULL,
  "page"        INTEGER NOT NULL DEFAULT 1,
  "x"           DOUBLE PRECISION NOT NULL,
  "y"           DOUBLE PRECISION NOT NULL,
  "width"       DOUBLE PRECISION NOT NULL,
  "height"      DOUBLE PRECISION NOT NULL,
  "required"    BOOLEAN NOT NULL DEFAULT TRUE,
  "value"       TEXT,
  "filledAt"    TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "EnvelopeField_envelopeId_idx" ON "EnvelopeField"("envelopeId");
CREATE INDEX IF NOT EXISTS "EnvelopeField_recipientId_idx" ON "EnvelopeField"("recipientId");

CREATE TABLE IF NOT EXISTS "EnvelopeEvent" (
  "id"          TEXT PRIMARY KEY,
  "envelopeId"  TEXT NOT NULL REFERENCES "Envelope"("id") ON DELETE CASCADE,
  "recipientId" TEXT,
  "type"        TEXT NOT NULL,
  "ip"          TEXT,
  "userAgent"   TEXT,
  "meta"        TEXT,
  "createdAt"   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS "EnvelopeEvent_env_idx" ON "EnvelopeEvent"("envelopeId", "createdAt");
