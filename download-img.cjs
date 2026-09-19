const fs = require('fs');
const https = require('https');

const url = "https://images.unsplash.com/photo-1585135497273-1a86d9d9c5e5?q=80&w=1920&auto=format&fit=crop";

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  if (res.statusCode === 301 || res.statusCode === 302) {
    https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
      const file = fs.createWriteStream("public/hero-bg.jpg");
      res2.pipe(file);
      file.on('finish', () => console.log('Downloaded redirected'));
    });
  } else {
    const file = fs.createWriteStream("public/hero-bg.jpg");
    res.pipe(file);
    file.on('finish', () => console.log('Downloaded'));
  }
});
