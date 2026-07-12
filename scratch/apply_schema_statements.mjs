import fs from 'fs';
import { execSync } from 'child_process';

const sqlFile = 'migrations/20260712061000_schema-remaining-entities.sql';
const sqlContent = fs.readFileSync(sqlFile, 'utf8');

function stripComments(sql) {
  return sql.replace(/--.*$/gm, '');
}

function splitSql(sql) {
  const statements = [];
  let current = '';
  let inDollarQuote = false;
  
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const nextTwo = sql.substr(i, 2);
    
    if (nextTwo === '$$') {
      inDollarQuote = !inDollarQuote;
      current += '$$';
      i++; // skip next char
      continue;
    }
    
    if (char === ';' && !inDollarQuote) {
      current += ';';
      statements.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    statements.push(current.trim());
  }
  return statements;
}

// 1. Drop existing tables if they exist to start from a clean state
console.log('Cleaning up existing entity tables...');
try {
  const dropQuery = 'DROP TABLE IF EXISTS public.resource_bookings, public.maintenance_requests, public.audit_items, public.audits, public.asset_allocations, public.notifications, public.activity_logs CASCADE;';
  const command = `npx @insforge/cli db query "${dropQuery}"`;
  execSync(command, { stdio: 'inherit' });
} catch (e) {
  console.log('Drop tables failed or skipped:', e.message);
}

const cleanSql = stripComments(sqlContent);
const rawStatements = splitSql(cleanSql);
const rawCleanStatements = rawStatements
  .map(s => s.replace(/\s+/g, ' ').trim())
  .filter(s => s.length > 0);

const grouped = [];
let currentGroup = '';

for (const stmt of rawCleanStatements) {
  if (stmt.includes('$$') || stmt.toLowerCase().includes('function') || stmt.toLowerCase().includes('trigger')) {
    if (currentGroup) {
      grouped.push(currentGroup);
      currentGroup = '';
    }
    grouped.push(stmt);
  } else {
    const stmtWithSemi = stmt.endsWith(';') ? stmt : stmt + ';';
    if (currentGroup.length + stmtWithSemi.length + 1 > 5000) {
      grouped.push(currentGroup);
      currentGroup = stmtWithSemi;
    } else {
      currentGroup += (currentGroup ? ' ' : '') + stmtWithSemi;
    }
  }
}
if (currentGroup) {
  grouped.push(currentGroup);
}

console.log(`Found ${rawCleanStatements.length} raw statements. Grouped into ${grouped.length} query batches.`);

for (let i = 0; i < grouped.length; i++) {
  const query = grouped[i];
  console.log(`Executing batch ${i + 1}/${grouped.length} (${query.length} chars)...`);
  try {
    const escapedQuery = query.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const command = `npx @insforge/cli db query "${escapedQuery}"`;
    execSync(command, { stdio: 'inherit' });
  } catch (err) {
    console.error(`Batch ${i + 1} failed!`);
    console.error('Query:', query);
    console.error(err.message);
    process.exit(1);
  }
}

console.log('Schema migration applied successfully!');
