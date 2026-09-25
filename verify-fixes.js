import 'dotenv/config';

const BASE = 'http://localhost:5000';

async function test() {
  console.log('=== SECURITY FIX VERIFICATION ===\n');

  // Test 1: Health check
  const health = await fetch(`${BASE}/api/health`);
  const hBody = await health.json();
  console.log(`1. Health Check: ${health.status === 200 ? '✅ PASS' : '❌ FAIL'} (${health.status})`);

  // Test 2: Security headers still present
  const xFrame = health.headers.get('x-frame-options');
  const xPowered = health.headers.get('x-powered-by');
  console.log(`2. X-Frame-Options: ${xFrame === 'DENY' ? '✅ PASS' : '❌ FAIL'} (${xFrame})`);
  console.log(`3. X-Powered-By Hidden: ${!xPowered ? '✅ PASS' : '❌ FAIL'}`);

  // Test 3: Login works (JWT signing with env secret)
  const login = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'akash203037@gmail.com', password: 'test1234' }),
  });
  const loginBody = await login.json();
  console.log(`4. Login (JWT from env): ${loginBody.token ? '✅ PASS — Token generated' : '❌ FAIL'} (${login.status})`);

  // Test 4: CORS blocks unknown origin
  const corsRes = await fetch(`${BASE}/api/health`, {
    headers: { Origin: 'https://evil-attacker.com' },
  });
  // Note: fetch doesn't enforce CORS client-side, but we can check the headers
  const allowOrigin = corsRes.headers.get('access-control-allow-origin');
  console.log(`5. CORS Origin Whitelist: ${allowOrigin !== 'https://evil-attacker.com' ? '✅ PASS — Evil origin not reflected' : '❌ FAIL'} (Allow-Origin: ${allowOrigin})`);

  // Test 5: CORS allows legitimate origin
  const corsGood = await fetch(`${BASE}/api/health`, {
    headers: { Origin: 'http://localhost:5174' },
  });
  const goodOrigin = corsGood.headers.get('access-control-allow-origin');
  console.log(`6. CORS Allows localhost:5174: ${goodOrigin === 'http://localhost:5174' ? '✅ PASS' : '❌ FAIL'} (Allow-Origin: ${goodOrigin})`);

  // Test 6: Protected route still secured
  const noToken = await fetch(`${BASE}/api/contact/messages`);
  console.log(`7. Protected Route (no token): ${noToken.status === 401 ? '✅ PASS' : '❌ FAIL'} (${noToken.status})`);

  // Test 7: Forged JWT still rejected
  const forged = await fetch(`${BASE}/api/contact/messages`, {
    headers: { Authorization: 'Bearer faketoken.payload.signature' },
  });
  console.log(`8. Forged JWT Rejected: ${forged.status === 401 ? '✅ PASS' : '❌ FAIL'} (${forged.status})`);

  console.log('\n=== VERIFICATION COMPLETE ===');
}

test().catch(console.error).finally(() => process.exit(0));
