const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run(cmd, label) {
  if (label) console.log(`\n=== ${label} ===`);
  console.log(`$ ${cmd}`);
  const r = await ssh.execCommand(cmd);
  if (r.stdout) console.log(r.stdout);
  if (r.stderr) console.log('STDERR:', r.stderr);
  return r;
}

async function audit2() {
  try {
    await ssh.connect({
      host: '117.252.16.132',
      username: 'root',
      password: 'b&Doe2K46e%1',
      readyTimeout: 30000,
      keepaliveInterval: 10000,
    });

    // Check suspicious PHP files
    await run('cat /root/check_users.php', 'SUSPICIOUS PHP: check_users.php');
    await run('cat /root/desc_users.php', 'SUSPICIOUS PHP: desc_users.php');
    
    // Check /tmp scripts from yesterday
    await run('cat /tmp/security_audit.sh 2>/dev/null | head -30', 'TMP: security_audit.sh');
    await run('cat /tmp/security_fixes.sh 2>/dev/null | head -30', 'TMP: security_fixes.sh');
    await run('cat /tmp/deep_audit.sh 2>/dev/null | head -30', 'TMP: deep_audit.sh');
    await run('cat /tmp/deep_fixes.sh 2>/dev/null | head -30', 'TMP: deep_fixes.sh');
    
    // Find NTT website
    await run('ls -la /root/ | head -30', 'ROOT DIRECTORY');
    await run('ls -la /root/DACC/ 2>/dev/null | head -20', 'DACC DIRECTORY');
    await run('ls -la /root/ntt* 2>/dev/null || find /root -maxdepth 2 -iname "*ntt*" 2>/dev/null | head -10', 'NTT FILES');
    
    // Check nginx full config for NTT
    await run('cat /etc/nginx/conf.d/*.conf 2>/dev/null', 'FULL NGINX CONFIGS');
    
    // Check what runs on port 4000 (ntt_website?)
    await run('curl -s http://localhost:4000 2>&1 | head -20', 'PORT 4000 CHECK');
    await run('curl -s http://localhost:3001/api/categories 2>&1 | head -5', 'PORT 3001 (ARANYAK) CHECK');
    
    // Check httpd/apache
    await run('httpd -S 2>&1 | head -20 || apachectl -S 2>&1 | head -20', 'APACHE VIRTUAL HOSTS');
    
    // Check for malware signatures
    await run('find /root -name "*.py" -mtime -3 2>/dev/null | head -10', 'RECENT PYTHON SCRIPTS');
    await run('find /root -name "*.js" -mtime -1 -not -path "*/node_modules/*" 2>/dev/null | head -20', 'RECENTLY MODIFIED JS FILES');
    
    // Check failed login attempts count
    await run('journalctl -u sshd --since "2026-07-15" 2>/dev/null | grep -c "Failed password" || echo "unknown"', 'TOTAL FAILED SSH ATTEMPTS SINCE YESTERDAY');

    console.log('\n✅ Deep audit complete!');
    ssh.dispose();
  } catch (error) {
    console.error('Failed:', error.message);
    process.exit(1);
  }
}

audit2();
