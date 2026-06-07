const https = require('https');

https.get('https://aranyakjewellers.vercel.app/IMG_20260603_123905.png', (res) => {
  console.log(`Image Status: ${res.statusCode}`);
  process.exit(0);
}).on('error', err => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
