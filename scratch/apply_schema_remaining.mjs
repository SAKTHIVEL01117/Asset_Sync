import fs from 'fs';
import { execSync } from 'child_process';

const sqlFile = 'migrations/20260712061000_schema-remaining-entities.sql';
const sqlContent = fs.readFileSync(sqlFile, 'utf8');

// Replace all newlines/carriage returns and multiple spaces with a single space
const singleLineSql = sqlContent.replace(/\s+/g, ' ').trim();

console.log('Applying migrations/20260712061000_schema-remaining-entities.sql...');
try {
  // Escape backslashes and double quotes
  const escapedSql = singleLineSql.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const command = `npx @insforge/cli db query "${escapedSql}"`;
  
  const stdout = execSync(command, { encoding: 'utf8' });
  console.log('CLI Output:', stdout);
  console.log('Schema migration applied successfully!');
} catch (err) {
  console.error('Migration failed!');
  console.error(err.message);
  if (err.stdout) console.log('STDOUT:', err.stdout);
  if (err.stderr) console.error('STDERR:', err.stderr);
  process.exit(1);
}
