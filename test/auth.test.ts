import { hashPassword, verifyPassword, hashToken, normalizeEmail } from '../server/backend/common/utils/security';
import { rbacService, SYSTEM_ROLES, SYSTEM_PERMISSIONS } from '../server/backend/services/rbac.service';

async function runTests() {
  console.log('🧪 Running Backend Core Architecture Tests...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, title: string) {
    if (condition) {
      console.log(`✅ PASSED: ${title}`);
      passed++;
    } else {
      console.error(`❌ FAILED: ${title}`);
      failed++;
    }
  }

  // 1. Password Hashing
  const rawPass = 'SignaluxSecretPass2026!';
  const hashed = await hashPassword(rawPass);
  assert(hashed !== rawPass, 'Password should be hashed securely');
  
  const isValid = await verifyPassword(rawPass, hashed);
  assert(isValid === true, 'Valid password verification should succeed');

  const isInvalid = await verifyPassword('WrongPass123', hashed);
  assert(isInvalid === false, 'Invalid password verification should fail');

  // 2. Email Normalization
  const rawEmail = '  Admin.Signalux@Example.COM  ';
  const cleanEmail = normalizeEmail(rawEmail);
  assert(cleanEmail === 'admin.signalux@example.com', 'Email should be trimmed and lowercased');

  // 3. Token Hashing
  const token = 'sample_refresh_token_xyz_123';
  const hashedToken1 = hashToken(token);
  const hashedToken2 = hashToken(token);
  assert(hashedToken1 === hashedToken2, 'Token hash should be deterministic SHA256');
  assert(hashedToken1.length === 64, 'SHA256 hex digest should be 64 characters');

  // 4. System Roles & Permissions
  assert(SYSTEM_ROLES.length === 5, 'Should define 5 system roles');
  assert(SYSTEM_PERMISSIONS.length >= 10, 'Should define granular system permissions');

  // 5. RBAC Permission Checker
  const hasPerm = rbacService.hasPermission(['users.view', 'services.view'], 'users.view');
  assert(hasPerm === true, 'User with explicit permission should pass guard check');

  const missingPerm = rbacService.hasPermission(['services.view'], 'users.delete');
  assert(missingPerm === false, 'User without permission should fail guard check');

  const superAdminPerm = rbacService.hasPermission(['SUPER_ADMIN'], 'anything.at.all');
  assert(superAdminPerm === true, 'SUPER_ADMIN role bypasses explicit permission checks');

  console.log(`\n📊 Test Summary: ${passed} Passed, ${failed} Failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
