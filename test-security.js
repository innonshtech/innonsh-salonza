const http = require('http');

async function runTests() {
  console.log("Starting Security Verification Tests...\n");

  // Test 1: Rate Limiting (Login Endpoint)
  console.log("--- Test 1: Rate Limiting on Login Endpoint ---");
  let rateLimitHit = false;
  for (let i = 0; i < 7; i++) {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'wrongpassword' })
    }).catch(e => null);
    
    if (res && res.status === 429) {
      console.log(`✅ Attempt ${i+1}: Blocked by Rate Limiter (429 Too Many Requests)`);
      rateLimitHit = true;
      break;
    } else if (res) {
      console.log(`Attempt ${i+1}: Allowed (Status ${res.status})`);
    } else {
      console.log(`Attempt ${i+1}: Server not running or unreachable`);
      break;
    }
  }
  if (!rateLimitHit) console.log("❌ Rate Limiting failed or server not running.");

  // Test 2: Sanitization (XSS and NoSQL)
  console.log("\n--- Test 2: NoSQL Injection / XSS Sanitization ---");
  const payload = {
    email: { "$gt": "" }, // NoSQL Injection attempt
    password: "<script>alert('xss')</script>password123" // XSS Attempt
  };
  
  const res2 = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(e => null);

  if (res2) {
    const data = await res2.json();
    console.log(`Server responded with Status: ${res2.status}`);
    // If validation fails, Zod should block it. If it passes, the $gt should be stripped.
    if (res2.status === 400 || (data.message && data.message.includes('Invalid'))) {
      console.log("✅ Malicious payload was sanitized/blocked successfully.");
    } else {
      console.log("⚠️ Payload behavior check required.");
    }
  }

  // Test 3: CORS Enforcement (Assuming external origin)
  console.log("\n--- Test 3: CORS Headers Verification ---");
  const res3 = await fetch('http://localhost:3000/api/auth/login', {
    method: 'OPTIONS',
    headers: { 
      'Origin': 'http://malicious-site.com',
      'Access-Control-Request-Method': 'POST'
    }
  }).catch(e => null);

  if (res3) {
    const allowOrigin = res3.headers.get('access-control-allow-origin');
    if (allowOrigin === 'http://localhost:3000') {
      console.log("✅ CORS strictly limits Origin to http://localhost:3000");
    } else {
      console.log("❌ CORS headers missing or permissive. Found: " + allowOrigin);
    }
  }

  // Test 4: Security Headers
  console.log("\n--- Test 4: General Security Headers ---");
  const res4 = await fetch('http://localhost:3000/').catch(e => null);
  if (res4) {
    console.log("HSTS (Strict-Transport-Security):", res4.headers.get('strict-transport-security') ? '✅ Present' : '❌ Missing');
    console.log("X-Frame-Options:", res4.headers.get('x-frame-options') ? '✅ Present' : '❌ Missing');
    console.log("X-XSS-Protection:", res4.headers.get('x-xss-protection') ? '✅ Present' : '❌ Missing');
  }

  console.log("\nVerification Complete.");
}

runTests();
