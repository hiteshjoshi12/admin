const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const targetUrls = [
  { label: 'Home (/)', url: 'http://localhost:5000/' },
  { label: 'Gul Blush Product', url: 'http://localhost:5000/product/gul-blush-handcrafted-embroidered-bridal-punjabi-jutti' }
];

function median(values) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function runBenchmark(suiteName = 'current') {
  console.log(`=== RUNNING 5 LIGHTHOUSE RUNS FOR: ${suiteName.toUpperCase()} ===\n`);
  const suiteResults = {};

  for (const target of targetUrls) {
    console.log(`\nBenchmarking ${target.label} (5 runs)...`);
    const runs = [];

    for (let i = 1; i <= 5; i++) {
      const outputPath = path.join(__dirname, `lh_${suiteName}_${target.label.replace(/[^a-zA-Z0-9]/g, '_')}_run${i}.json`);
      console.log(`  [Run ${i}/5] Executing Lighthouse...`);
      try {
        execSync(
          `npx lighthouse ${target.url} --chrome-flags="--headless=new --no-sandbox" --only-categories=performance --output=json --output-path="${outputPath}"`,
          { stdio: ['ignore', 'ignore', 'pipe'] }
        );

        const rep = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
        const a = rep.audits;
        const result = {
          run: i,
          score: Math.round(rep.categories.performance.score * 100),
          fcp: a['first-contentful-paint'].numericValue,
          fcpDisplay: a['first-contentful-paint'].displayValue,
          lcp: a['largest-contentful-paint'].numericValue,
          lcpDisplay: a['largest-contentful-paint'].displayValue,
          tbt: a['total-blocking-time'].numericValue,
          tbtDisplay: a['total-blocking-time'].displayValue,
          cls: a['cumulative-layout-shift'].numericValue,
          clsDisplay: a['cumulative-layout-shift'].displayValue
        };
        runs.push(result);
        console.log(`    Run ${i}: Score=${result.score}, FCP=${result.fcpDisplay}, LCP=${result.lcpDisplay}, TBT=${result.tbtDisplay}, CLS=${result.clsDisplay}`);
      } catch (err) {
        console.error(`    Run ${i} failed:`, err.message);
      }
    }

    const medians = {
      score: median(runs.map(r => r.score)),
      fcp: Math.round(median(runs.map(r => r.fcp))),
      lcp: Math.round(median(runs.map(r => r.lcp))),
      tbt: Math.round(median(runs.map(r => r.tbt))),
      cls: Number(median(runs.map(r => r.cls)).toFixed(4)),
      allRuns: runs
    };

    console.log(`\n  >> ${target.label} MEDIANS: Score=${medians.score}, FCP=${(medians.fcp/1000).toFixed(1)}s, LCP=${(medians.lcp/1000).toFixed(1)}s, TBT=${medians.tbt}ms, CLS=${medians.cls}`);
    suiteResults[target.label] = medians;
  }

  const outSummary = path.join(__dirname, `summary_${suiteName}.json`);
  fs.writeFileSync(outSummary, JSON.stringify(suiteResults, null, 2));
  console.log(`\nSaved summary to: ${outSummary}`);
  return suiteResults;
}

const suite = process.argv[2] || 'branch';
runBenchmark(suite).catch(console.error);

