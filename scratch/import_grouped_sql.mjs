import fs from 'fs';
import { execSync } from 'child_process';

const raw = fs.readFileSync('scratch/grouped_statements.json', 'utf8');
const statements = JSON.parse(raw);

console.log(`Executing ${statements.length} grouped SQL queries on single lines...`);
const logs = [];

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i];
  // Replace newlines and extra spaces with a single space to make it a single line query
  const singleLineStmt = stmt.replace(/\s+/g, ' ').trim();
  console.log(`Executing query ${i + 1}/${statements.length}...`);
  
  try {
    // Escape backslashes and double quotes for shell execution
    const escapedStmt = singleLineStmt.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const command = `npx @insforge/cli db query "${escapedStmt}"`;
    
    const stdout = execSync(command, { encoding: 'utf8' });
    
    logs.push({
      index: i + 1,
      status: 0,
      stdout: stdout
    });
  } catch (err) {
    console.error(`Query ${i + 1} failed! Check scratch/grouped_import.log`);
    logs.push({
      index: i + 1,
      status: err.status || 1,
      stderr: err.message,
      stdout: err.stdout
    });
    fs.writeFileSync('scratch/grouped_import.log', JSON.stringify(logs, null, 2));
    process.exit(1);
  }
}

fs.writeFileSync('scratch/grouped_import.log', JSON.stringify(logs, null, 2));
console.log('Grouped migration executed successfully on single lines!');
