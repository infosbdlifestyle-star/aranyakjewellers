const http = require('http');

http.get('http://117.252.16.132:3001/uploads/hero-banner.png', (res) => {
  console.log('VPS GET Image Status:', res.statusCode);
});
