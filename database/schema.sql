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
