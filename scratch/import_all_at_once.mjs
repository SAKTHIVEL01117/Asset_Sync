import fs from 'fs';
import { spawnSync } from 'child_process';

const sqlFile = 'migrations/20260712070000_seed-production-data.sql';
const sqlContent = fs.readFileSync(sqlFile, 'utf8');

console.log(`Sending entire SQL migration (${sqlContent.length} bytes) to database...`);
const res = spawnSync('npx', ['@insforge/cli', 'db', 'query', sqlContent], { 
  shell: true, 
  encoding: 'utf8' 
});

fs.writeFileSync('scratch/import.log', `STATUS: ${res.status}\nSTDOUT:\n${res.stdout}\nSTDERR:\n${res.stderr}\n`);

if (res.status !== 0) {
  console.error('CLI exited with error. Check scratch/import.log');
  process.exit(1);
}

console.log('Migration executed successfully!');
