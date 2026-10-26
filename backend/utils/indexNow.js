const https = require('https');

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'c89e24b5a67f4a2da54c861e3895e347';
const HOST = 'beadsandbloom.in';

/**
 * Submit URLs to IndexNow protocol (Bing, Yandex, Seznam, Naver)
 * Non-blocking, fails gracefully.
 */
async function pingIndexNow(urls) {
  if (!Array.isArray(urls) || urls.length === 0) return;

  const payload = JSON.stringify({
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    urlList: urls
  });

  const options = {
    hostname: 'api.indexnow.org',
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(payload)
    },
    timeout: 5000
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`[IndexNow] Pinged ${urls.length} URLs, status: ${res.statusCode}`);
        resolve({ status: res.statusCode, body: data });
      });
    });

    req.on('error', (err) => {
      console.warn(`[IndexNow] Ping error:`, err.message);
      resolve({ error: err.message });
    });

    req.on('timeout', () => {
      req.destroy();
      console.warn(`[IndexNow] Ping timeout`);
      resolve({ timeout: true });
    });

    req.write(payload);
    req.end();
  });
}

module.exports = {
  pingIndexNow,
  INDEXNOW_KEY
};
