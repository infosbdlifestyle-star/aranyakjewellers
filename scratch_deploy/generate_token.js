const jwt = require('jsonwebtoken');

// Generate a fake admin token
const token = jwt.sign(
  { id: 'fake_admin_id', email: 'admin@aranyak.com', role: 'ADMIN' },
  'aranyak_secret_key_production_deploy_secure',
  { expiresIn: '1h' }
);
console.log('TOKEN:', token);
