import { createBrowserClient } from '@insforge/sdk/ssr';
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

const insforge = createBrowserClient();

async function main() {
  try {
    const { data, error } = await insforge.database.from('employees').select('*');
    if (error) {
      console.error('Error fetching employees:', error);
    } else {
      console.log('Employees in DB:', data);
    }
  } catch (err) {
    console.error('Failed to run query:', err);
  }
}

main();
