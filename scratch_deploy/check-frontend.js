const http = require('http');
const https = require('https');

function checkUrl(url, label) {
  const lib = url.startsWith('https') ? https : http;
  lib.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const hasMarquee = data.includes('animate-marquee') || data.includes('100% BIS Hallmarked');
      const hasTimeless = data.includes('Timeless');
      console.log(`[${label}] - Status: ${res.statusCode}`);
      console.log(`[${label}] - Has Marquee? ${hasMarquee}`);
      console.log(`[${label}] - Has Timeless? ${hasTimeless}`);
      if (res.statusCode >= 300 && res.statusCode < 400) {
        console.log(`[${label}] - Redirected to: ${res.headers.location}`);
      }
    });
  }).on('error', err => {
    console.error(`[${label}] - Error: ${err.message}`);
  });
}

checkUrl('http://localhost:3000', 'LOCAL');
checkUrl('https://aranyakjewellers-nni0gltuz-infosbdlifestyle-9638s-projects.vercel.app', 'VERCEL_DEPLOY');
checkUrl('https://aranyakjewellers.vercel.app', 'VERCEL_PROD');
