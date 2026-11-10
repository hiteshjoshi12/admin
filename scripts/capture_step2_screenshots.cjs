const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9225;
const outputDir = path.join(__dirname, '../scratch/screenshots/step2_after');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function sendCdp(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const onMsg = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.id === id) {
          ws.removeEventListener('message', onMsg);
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result);
        }
      } catch (e) {}
    };
    ws.addEventListener('message', onMsg);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

const targets = [
  { name: 'home_hero', url: 'http://localhost:5000/' },
  { name: 'collection_bridal', url: 'http://localhost:5000/collection/bridal' },
  { name: 'product_gul_blush', url: 'http://localhost:5000/product/gul-blush-handcrafted-embroidered-bridal-punjabi-jutti' }
];

const viewports = [
  { label: 'mobile', width: 393, height: 852, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { label: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false }
];

async function capture() {
  console.log('=== CAPTURING STEP 2 SCREENSHOTS ===\n');

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    '--remote-allow-origins=*',
    'about:blank'
  ], { stdio: 'ignore' });

  let wsUrl = null;
  for (let i = 0; i < 20; i++) {
    try {
      const ver = await getJson(`http://127.0.0.1:${port}/json/version`);
      if (ver.webSocketDebuggerUrl) {
        wsUrl = ver.webSocketDebuggerUrl;
        break;
      }
    } catch (e) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  const browserWs = new WebSocket(wsUrl);
  await new Promise(r => browserWs.onopen = r);

  try {
    for (const target of targets) {
      for (const vp of viewports) {
        for (const jsEnabled of [false, true]) {
          const jsLabel = jsEnabled ? 'hydrated' : 'no_js';
          const filename = `${target.name}_${vp.label}_${jsLabel}.png`;
          const filePath = path.join(outputDir, filename);

          console.log(`Capturing: ${filename} (Width: ${vp.width}, JS: ${jsEnabled})`);

          const { targetId } = await sendCdp(browserWs, 'Target.createTarget', { url: 'about:blank' });
          const targetWs = new WebSocket(`ws://127.0.0.1:${port}/devtools/page/${targetId}`);
          await new Promise(r => targetWs.onopen = r);

          try {
            await sendCdp(targetWs, 'Page.enable');
            await sendCdp(targetWs, 'Emulation.setDeviceMetricsOverride', {
              width: vp.width,
              height: vp.height,
              deviceScaleFactor: vp.deviceScaleFactor,
              mobile: vp.isMobile,
              hasTouch: vp.hasTouch
            });

            if (!jsEnabled) {
              await sendCdp(targetWs, 'Emulation.setScriptExecutionDisabled', { value: true });
            }

            await sendCdp(targetWs, 'Page.navigate', { url: target.url });
            await new Promise(r => setTimeout(r, jsEnabled ? 3500 : 1500));

            // Capture viewport screenshot
            const shot = await sendCdp(targetWs, 'Page.captureScreenshot', {
              format: 'png',
              captureBeyondViewport: false
            });

            fs.writeFileSync(filePath, Buffer.from(shot.data, 'base64'));
            console.log(`  -> Saved ${filename} (${(fs.statSync(filePath).size / 1024).toFixed(1)} KB)`);
          } finally {
            await sendCdp(browserWs, 'Target.closeTarget', { targetId });
          }
        }
      }
    }
    console.log('\nAll screenshots captured successfully!');
  } finally {
    try { browserWs.close(); } catch (e) {}
    try { execSync(`taskkill /pid ${chromeProc.pid} /T /F`, { stdio: 'ignore' }); } catch (e) {}
  }
}

capture().catch(console.error);
