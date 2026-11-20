-- Apply once to an existing PHP database after a backup. Fresh databases use database.sql.
ALTER TABLE users
  ADD COLUMN verifiedPhone VARCHAR(30) DEFAULT NULL UNIQUE,
  ADD COLUMN googleSubject VARCHAR(191) DEFAULT NULL UNIQUE;

CREATE TABLE IF NOT EXISTS customer_auth_challenges (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  rateKey VARCHAR(100) NOT NULL UNIQUE,
  kind VARCHAR(8) NOT NULL,
  subject VARCHAR(191) NOT NULL,
  proofHash CHAR(64) NOT NULL,
  ipKey CHAR(64) NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  expiresAt DATETIME(3) NOT NULL,
  consumedAt DATETIME(3) DEFAULT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_customer_challenge_subject (kind, subject, createdAt),
  KEY idx_customer_challenge_ip (kind, ipKey, createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
