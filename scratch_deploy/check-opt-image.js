const https = require('https');

https.get('https://aranyakjewellers.vercel.app/_next/image?url=%2FIMG_20260603_123905.png&w=1080&q=75', (res) => {
  console.log(`Optimized Image Status: ${res.statusCode}`);
  process.exit(0);
}).on('error', err => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
