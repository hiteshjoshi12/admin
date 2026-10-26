import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Truly static routes (CMS-backed /about is injected dynamically from MongoDB)
const routes = [
  '/contact',
  '/terms',
  '/size-chart',
  '/care-guide',
  '/bridal-guide',
  '/privacy-policy'
];

function getChromePath() {
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN;
  if (process.platform === 'win32') {
    const candidates = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
    ];
    for (const bin of candidates) {
      if (fs.existsSync(bin)) return bin;
    }
  } else if (process.platform === 'darwin') {
    return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  } else {
    const candidates = [
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      'google-chrome',
      'chromium'
    ];
    for (const bin of candidates) {
      try {
        execSync(`which ${bin}`, { stdio: 'ignore' });
        return bin;
      } catch (e) {}
    }
  }
  return 'google-chrome';
}

function cleanRootHtml(rawRoot) {
  let cleaned = rawRoot;

  // 1. Strip script tags
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // 2. Strip style tags
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // 3. Strip link tags
  cleaned = cleaned.replace(/<link\b[^>]*>/gi, '');

  // 4. Strip framer-motion opacity:0 initial inline styles that hide text
  cleaned = cleaned.replace(/style="([^"]*)"/gi, (match, styleContent) => {
    const updated = styleContent
      .replace(/opacity\s*:\s*0\s*;?/gi, 'opacity: 1;')
      .replace(/visibility\s*:\s*hidden\s*;?/gi, 'visibility: visible;');
    return `style="${updated}"`;
  });

  return cleaned.trim();
}

async function startPreviewServer(port) {
  return new Promise((resolve, reject) => {
    const previewProcess = spawn('npx', ['vite', 'preview', '--port', String(port), '--strictPort'], {
      cwd: path.join(__dirname, '../Frontend'),
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let started = false;
    previewProcess.stdout.on('data', (data) => {
      const msg = data.toString();
      if (msg.includes('Local:') || msg.includes('http://localhost:')) {
        if (!started) {
          started = true;
          resolve(previewProcess);
        }
      }
    });

    setTimeout(() => {
      if (!started) {
        started = true;
        resolve(previewProcess);
      }
    }, 4000);

    previewProcess.on('error', reject);
  });
}

async function runPrerender() {
  const chromePath = getChromePath();
  console.log(`[prerender] Using Chrome at: ${chromePath}`);

  const port = 4173;
  console.log(`[prerender] Starting Vite preview server on port ${port}...`);
  const serverProcess = await startPreviewServer(port);

  // Allow server to stabilize
  await new Promise(r => setTimeout(r, 1000));

  const results = {};
  let hasFailure = false;

  try {
    for (const route of routes) {
      const url = `http://localhost:${port}${route}`;
      console.log(`[prerender] Capturing ${route} ...`);

      try {
        const rawOutput = execSync(
          `"${chromePath}" --headless --no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage --disable-gpu --virtual-time-budget=5000 --dump-dom "${url}"`,
          {
            encoding: 'utf8',
            maxBuffer: 20 * 1024 * 1024,
            timeout: 15000
          }
        );

        const startTag = '<div id="root">';
        const startIdx = rawOutput.indexOf(startTag);
        if (startIdx === -1) {
          console.error(`[FAIL] ${route}: <div id="root"> element not found!`);
          hasFailure = true;
          continue;
        }

        const bodyEndIdx = rawOutput.indexOf('</body>');
        const lastDivIdx = rawOutput.lastIndexOf('</div>', bodyEndIdx);
        const rawRoot = rawOutput.substring(startIdx + startTag.length, lastDivIdx);
        const cleanedRoot = cleanRootHtml(rawRoot);

        // Validation 1: #root must not be empty
        if (!cleanedRoot || cleanedRoot.length < 50) {
          console.error(`[FAIL] ${route}: #root is empty or under 50 characters (got ${cleanedRoot.length})!`);
          hasFailure = true;
          continue;
        }

        // Validation 2: Must contain an <h1> tag
        if (!/<h1\b[^>]*>/i.test(cleanedRoot)) {
          console.error(`[FAIL] ${route}: No <h1> heading found in #root!`);
          hasFailure = true;
          continue;
        }

        results[route] = cleanedRoot;
        console.log(`[SUCCESS] ${route}: Validated (Length: ${cleanedRoot.length} chars, <h1> verified)`);
      } catch (err) {
        console.error(`[FAIL] ${route}: Error during capture:`, err.message);
        hasFailure = true;
      }
    }
  } finally {
    // Kill preview server process tree
    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /pid ${serverProcess.pid} /T /F`, { stdio: 'ignore' });
      } else {
        execSync(`kill -9 ${serverProcess.pid} 2>/dev/null || true`, { stdio: 'ignore' });
      }
    } catch (e) {}
  }

  if (hasFailure || Object.keys(results).length !== routes.length) {
    console.error(`\n[FATAL] Prerender validation failed! Not all static pages passed #root & <h1> checks.`);
    process.exit(1);
  }

  // Write snapshot to backend/utils and Frontend/dist
  const outputPaths = [
    path.join(__dirname, '../backend/utils/prerendered-static.json'),
    path.join(__dirname, '../Frontend/dist/prerendered-static.json')
  ];

  for (const outPath of outputPaths) {
    const dir = path.dirname(outPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
    console.log(`[prerender] Saved snapshot to: ${outPath}`);
  }

  console.log(`\n[prerender] All ${routes.length} static routes successfully captured and validated!\n`);
  process.exit(0);
}

runPrerender().catch(err => {
  console.error('[FATAL] Prerender script encountered an unhandled error:', err);
  process.exit(1);
});
