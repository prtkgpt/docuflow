-- DocuFlow demo seed data.
-- Paste this into the Neon SQL Editor after running schema.sql.

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
