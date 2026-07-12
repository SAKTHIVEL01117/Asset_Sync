import fs from 'fs';
import { spawnSync } from 'child_process';

try {
  const res = spawnSync('npx', ['@insforge/cli', 'db', 'query', 'SELECT 1;'], { 
    shell: true, 
    encoding: 'utf8' 
  });
  
  fs.writeFileSync('scratch/spawn_debug.json', JSON.stringify({
    status: res.status,
    signal: res.signal,
    error: res.error ? {
      message: res.error.message,
      stack: res.error.stack,
      code: res.error.code
    } : null,
    stdout: res.stdout,
    stderr: res.stderr
  }, null, 2));
  
  console.log('Inspection file written.');
} catch (e) {
  console.error('Catch block error:', e);
}
