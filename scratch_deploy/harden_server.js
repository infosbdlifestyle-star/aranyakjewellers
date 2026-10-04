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

async function harden() {
  try {
    await ssh.connect({
      host: '117.252.16.132',
      username: 'root',
      password: 'b&Doe2K46e%1',
      readyTimeout: 30000,
      keepaliveInterval: 10000,
    });
    console.log('Connected! Hardening server...\n');

    // 1. Install fail2ban
    await run('dnf install -y epel-release 2>&1 | tail -3', 'INSTALL EPEL');
    await run('dnf install -y fail2ban 2>&1 | tail -5', 'INSTALL FAIL2BAN');
    
    // Configure fail2ban for SSH
    await run(`cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = /var/log/secure
maxretry = 3
bantime = 7200
EOF`, 'CONFIGURE FAIL2BAN');

    await run('systemctl enable --now fail2ban 2>&1', 'START FAIL2BAN');
    await run('fail2ban-client status sshd 2>&1', 'FAIL2BAN STATUS');

    // 2. Configure firewall
    await run('systemctl start firewalld 2>&1', 'START FIREWALL');
    await run('firewall-cmd --permanent --add-service=http 2>&1', 'ALLOW HTTP');
    await run('firewall-cmd --permanent --add-service=https 2>&1', 'ALLOW HTTPS');
    await run('firewall-cmd --permanent --add-service=ssh 2>&1', 'ALLOW SSH');
    await run('firewall-cmd --permanent --add-port=3001/tcp 2>&1', 'ALLOW PORT 3001');
    await run('firewall-cmd --permanent --add-port=4000/tcp 2>&1', 'ALLOW PORT 4000');
    await run('firewall-cmd --reload 2>&1', 'RELOAD FIREWALL');
    await run('firewall-cmd --list-all 2>&1', 'FIREWALL STATUS');

    console.log('\n✅ Server hardening complete!');
    ssh.dispose();
  } catch (error) {
    console.error('Failed:', error.message);
    process.exit(1);
  }
}

harden();
