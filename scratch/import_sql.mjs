import fs from 'fs';
import { execSync } from 'child_process';

const sqlFile = 'migrations/20260712070000_seed-production-data.sql';
const sqlContent = fs.readFileSync(sqlFile, 'utf8');

// Split SQL content into statements
// We split by semicolon followed by a newline, ignoring empty statements or comments
const statements = sqlContent
  .split(/;\r?\n/)
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`Found ${statements.length} statements to execute.`);

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i];
  console.log(`Executing statement ${i + 1}/${statements.length}...`);
  try {
    // Escape double quotes and backslashes for PowerShell/CMD command execution
    const escapedStmt = stmt.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const command = `npx @insforge/cli db query "${escapedStmt}"`;
    execSync(command, { stdio: 'inherit' });
  } catch (err) {
    console.error(`Error executing statement ${i + 1}:`, stmt);
    console.error(err.message);
    process.exit(1);
  }
}

console.log('All statements executed successfully!');
