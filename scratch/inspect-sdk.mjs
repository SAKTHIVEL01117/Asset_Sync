import * as sdk from '@insforge/sdk';
import { createAdminClient } from '@insforge/sdk';
import fs from 'fs';

// Load .env.local manually
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const k = trimmed.substring(0, idx).trim();
        const v = trimmed.substring(idx + 1).trim();
        process.env[k] = v;
      }
    }
  });
} catch (e) {
  console.error('Could not load .env.local', e);
}

console.log('SDK exports:', Object.keys(sdk));

const admin = createAdminClient({
  baseUrl: process.env.INSFORGE_PROJECT_URL,
  apiKey: process.env.INSFORGE_API_KEY,
});

console.log('Admin client keys:', Object.keys(admin));
console.log('Admin database keys:', admin.database ? Object.keys(admin.database) : 'No database');
