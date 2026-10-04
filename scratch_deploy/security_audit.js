const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run(cmd, label) {
  if (label) console.log(`\n=== ${label} ===`);
  console.log(`$ ${cmd}`);
  const r = await ssh.execCommand(cmd);
  if (r.stdout) console.log(r.stdout);
  if (r.stderr && !r.stderr.includes('Permission denied')) console.log('STDERR:', r.stderr);
  return r;
}

async function audit() {
  try {
    await ssh.connect({
      host: '117.252.16.132',
      username: 'root',
      password: 'b&Doe2K46e%1',
      readyTimeout: 30000,
      keepaliveInterval: 10000,
    });
    console.log('Connected! Running security audit...\n');

    // 1. Check all running processes
    await run('pm2 list', 'PM2 PROCESSES');
    
    // 2. Check for ntt_website
    await run('find /root -maxdepth 2 -name "package.json" -o -name "docker-compose.yml" 2>/dev/null | head -20', 'FIND NTT WEBSITE');
    await run('ls -la /root/ | grep -i ntt', 'NTT DIRECTORY');
    await run('ls -la /var/www/ 2>/dev/null', 'VAR WWW');
    
    // 3. Check all listening ports
    await run('ss -tlnp', 'LISTENING PORTS');
    
    // 4. Check for suspicious users
    await run('cat /etc/passwd | grep -v nologin | grep -v false | grep -v sync | grep -v halt | grep -v shutdown', 'USERS WITH LOGIN SHELL');
    await run('lastlog 2>/dev/null | grep -v "Never" | head -20', 'RECENT LOGINS');
    
    // 5. Check auth logs for brute force / suspicious SSH
    await run('cat /var/log/secure 2>/dev/null | grep "Failed password" | tail -20 || cat /var/log/auth.log 2>/dev/null | grep "Failed password" | tail -20 || journalctl -u sshd --since "yesterday" 2>/dev/null | grep -i "failed\\|invalid\\|attack" | tail -20', 'FAILED SSH LOGINS (LAST 24H)');
    await run('cat /var/log/secure 2>/dev/null | grep "Accepted" | tail -10 || journalctl -u sshd --since "yesterday" 2>/dev/null | grep "Accepted" | tail -10', 'SUCCESSFUL SSH LOGINS');
    
    // 6. Check for suspicious cron jobs
    await run('crontab -l 2>&1', 'ROOT CRON JOBS');
    await run('ls -la /etc/cron.d/ 2>/dev/null', 'CRON.D DIRECTORY');
    
    // 7. Check for unauthorized SSH keys
    await run('cat /root/.ssh/authorized_keys 2>/dev/null || echo "No authorized_keys"', 'SSH AUTHORIZED KEYS');
    
    // 8. Check for recently modified files (potential backdoors)
    await run('find /root -name "*.sh" -mtime -2 2>/dev/null | head -20', 'RECENTLY MODIFIED SHELL SCRIPTS');
    await run('find /tmp -type f -mtime -2 2>/dev/null | head -20', 'SUSPICIOUS FILES IN /tmp');
    await run('find /root -name "*.php" 2>/dev/null | head -10', 'PHP FILES (WEBSHELLS?)');
    
    // 9. Check firewall
    await run('iptables -L -n 2>/dev/null | head -30 || firewall-cmd --list-all 2>/dev/null', 'FIREWALL RULES');
    
    // 10. Check for running containers (docker)
    await run('docker ps -a 2>/dev/null || echo "Docker not running"', 'DOCKER CONTAINERS');
    
    // 11. Check nginx/apache config
    await run('nginx -t 2>&1 || echo "No nginx"', 'NGINX STATUS');
    await run('cat /etc/nginx/conf.d/*.conf 2>/dev/null | head -50 || echo "No nginx configs"', 'NGINX CONFIGS');
    
    // 12. Check disk usage and suspicious large files
    await run('df -h', 'DISK USAGE');
    
    // 13. Check system uptime and last reboot
    await run('uptime && last reboot | head -5', 'UPTIME & REBOOTS');
    
    // 14. Check for crypto miners or suspicious high-CPU processes  
    await run('ps aux --sort=-%cpu | head -10', 'TOP CPU PROCESSES');
    await run('ps aux --sort=-%mem | head -10', 'TOP MEMORY PROCESSES');

    console.log('\n\n✅ Security audit complete!');
    ssh.dispose();
  } catch (error) {
    console.error('Audit failed:', error.message);
    process.exit(1);
  }
}

audit();
