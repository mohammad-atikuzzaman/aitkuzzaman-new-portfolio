import https from 'https';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const html = await fetchUrl('https://majd-portfolio.framer.website/');
  const matches = [...html.matchAll(/https:\/\/framerusercontent\.com\/[^\s\"\'\)\>]+/g)].map(m => m[0]);
  const unique = [...new Set(matches)];
  console.log('Total Framer assets:', unique.length);
  const images = unique.filter(u => u.match(/\.(png|jpg|jpeg|webp|svg)/i) || u.includes('/images/'));
  console.log('Images found:', images.length);
  images.forEach(img => console.log(img));
}

run();
