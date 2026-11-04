const fs = require('fs');
const path = require('path');
const marge = require('mochawesome-merge');

async function mergeReports() {

  const inputFile = path.join(
    __dirname,
    '../reports/index.json'
  );

  const outputFile = path.join(
    __dirname,
    '../reports/merged/combined-report.json'
  );

  fs.mkdirSync(path.dirname(outputFile), {
    recursive: true
  });

  if (!fs.existsSync(inputFile)) {
    throw new Error('Mochawesome JSON file not found!');
  }

  const report = await marge.merge({
    files: [inputFile]
  });

  fs.writeFileSync(
    outputFile,
    JSON.stringify(report, null, 2)
  );

  console.log('Combined JSON report generated!');
}

mergeReports().catch(error => {
  console.error(error);
  process.exit(1);
});