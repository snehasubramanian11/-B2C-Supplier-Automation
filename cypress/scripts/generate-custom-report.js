const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '../..');
const jsonFile = path.join(
  projectRoot,
  'cypress/reports/mochawesome/index.json'
);
const outputFolder = path.join(
  projectRoot,
  'cypress/reports/custom-report'
);

const outputFile = path.join(outputFolder, 'index.html');
const project = {
  name: 'B2C Supplier Portal',
  title: 'QA Test Execution Report',
  tester: 'Sneha K',
  environment: 'QA / Staging',
  application: 'https://octopus-package-dashboard.vercel.app',
  api: 'https://b2cqa.bufferbytes.in',
  framework: 'Cypress 16.2.1',
  language: 'JavaScript',
  testType: 'Functional Testing'
};
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}
function extractTests(suites, parentTitles = []) {

  let tests = [];

  for (const suite of suites || []) {

    const currentTitles = [
      ...parentTitles,
      suite.title
    ].filter(Boolean);

    for (const test of suite.tests || []) {

      tests.push({
        title: test.title || 'Untitled test',

        fullTitle:
          test.fullTitle ||
          currentTitles.join(' > '),

        suite: currentTitles.join(' > '),

        state: test.state || 'unknown',

        duration: test.duration || 0,

        error: test.err?.message || '',

        stack:
          test.err?.estack ||
          test.err?.stack ||
          '',
        context: test.context || ''
      });

    }
    tests = tests.concat(
      extractTests(suite.suites, currentTitles)
    );

  }
  return tests;
}
function generateReport() {

  if (!fs.existsSync(jsonFile)) {
    throw new Error(
      `JSON report not found: ${jsonFile}`
    );
  }
  const report = JSON.parse(
    fs.readFileSync(jsonFile, 'utf8')
  );
  const suites = report.results?.flatMap(
    result => result.suites || []
  ) || report.suites || [];
  const allTests = extractTests(suites);

  if (allTests.length === 0) {
    throw new Error(
      'No test cases found inside the JSON report.'
    );
  }
  const total = allTests.length;

  const passed = allTests.filter(
    test => test.state === 'passed'
  ).length;

  const failed = allTests.filter(
    test => test.state === 'failed'
  ).length;

  const pending = allTests.filter(
    test => ['pending', 'skipped'].includes(test.state)
  ).length;

  const unknown = allTests.filter(
    test => !['passed', 'failed', 'pending', 'skipped'].includes(test.state)
  ).length;

  const duration = allTests.reduce(
    (sum, test) => sum + test.duration,
    0
  );

  const passRate = total
    ? ((passed / total) * 100).toFixed(1)
    : '0.0';

  const date = new Date().toLocaleString();
  const rows = allTests.map((test, index) => {

    const status = test.state.toLowerCase();

    return `
      <tr>
        <td>${index + 1}</td>

        <td>
          <strong>${escapeHtml(test.title)}</strong>

          <small>
            ${escapeHtml(test.suite)}
          </small>

          ${
            test.error
              ? `<div class="error">${escapeHtml(test.error)}</div>`
              : ''
          }
        </td>

        <td>
          <span class="status ${escapeHtml(status)}">
            ${escapeHtml(test.state)}
          </span>
        </td>

        <td>
          ${(test.duration / 1000).toFixed(2)} sec
        </td>
      </tr>
    `;

  }).join('');

  // Custom HTML design
  const html = `<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>${escapeHtml(project.title)}</title>

<style>

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f3f6fb;
  color: #263449;
  font-family: Arial, sans-serif;
}

.container {
  max-width: 1200px;
  margin: 35px auto;
  padding: 20px;
}

.header {
  background: #172554;
  color: white;
  padding: 35px;
  border-radius: 12px;
}

.header h1 {
  margin: 0 0 10px;
}

.header p {
  color: #cbd5e1;
}

.section {
  background: white;
  padding: 25px;
  border-radius: 12px;
  margin-top: 22px;
  box-shadow: 0 2px 10px rgba(0,0,0,.04);
}

.section h2 {
  margin-top: 0;
}

.info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

.info div {
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  overflow-wrap: anywhere;
}

.info small {
  display: block;
  color: #64748b;
  margin-bottom: 7px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 15px;
}

.card {
  padding: 22px;
  border-radius: 10px;
  background: #f8fafc;
}

.card h3 {
  font-size: 30px;
  margin: 0 0 8px;
}

.green {
  color: #16a34a;
}

.red {
  color: #dc2626;
}

.blue {
  color: #2563eb;
}

.orange {
  color: #d97706;
}

.progress {
  background: #e2e8f0;
  height: 12px;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 15px;
}

.progress span {
  display: block;
  height: 100%;
  background: #16a34a;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 14px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: top;
}

th {
  background: #f8fafc;
}

small {
  display: block;
  color: #64748b;
  margin-top: 6px;
}

.status {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  text-transform: uppercase;
}

.passed {
  color: #15803d;
  background: #dcfce7;
}

.failed {
  color: #b91c1c;
  background: #fee2e2;
}

.pending, .skipped {
  color: #92400e;
  background: #fef3c7;
}

.unknown {
  color: #475569;
  background: #e2e8f0;
}

.error {
  color: #b91c1c;
  margin-top: 8px;
  font-size: 12px;
  overflow-wrap: anywhere;
}

.footer {
  text-align: center;
  color: #64748b;
  padding: 25px;
}

@media(max-width: 650px) {

  .container {
    padding: 10px;
  }

  .header {
    padding: 22px;
  }

  table {
    font-size: 12px;
  }

  th, td {
    padding: 8px;
  }

}

</style>

</head>

<body>

<div class="container">

  <header class="header">

    <h1>B2C SUPPLIER AUTOMATION</h1>

    <h2>${escapeHtml(project.title)}</h2>

    <p>Automated Software Quality Assurance Report</p>

    <p>Generated: ${escapeHtml(date)}</p>

  </header>


  <section class="section">

    <h2>Project Information</h2>

    <div class="info">

      <div>
        <small>Project</small>
        ${escapeHtml(project.name)}
      </div>

      <div>
        <small>Tester</small>
        ${escapeHtml(project.tester)}
      </div>

      <div>
        <small>Environment</small>
        ${escapeHtml(project.environment)}
      </div>

      <div>
        <small>Framework</small>
        ${escapeHtml(project.framework)}
      </div>

      <div>
        <small>Language</small>
        ${escapeHtml(project.language)}
      </div>

      <div>
        <small>Test Type</small>
        ${escapeHtml(project.testType)}
      </div>

      <div>
        <small>Application URL</small>
        ${escapeHtml(project.application)}
      </div>

      <div>
        <small>API URL</small>
        ${escapeHtml(project.api)}
      </div>

    </div>

  </section>


  <section class="section">

    <h2>Execution Summary</h2>

    <div class="cards">

      <div class="card">
        <h3 class="blue">${total}</h3>
        Total Tests
      </div>

      <div class="card">
        <h3 class="green">${passed}</h3>
        Passed
      </div>

      <div class="card">
        <h3 class="red">${failed}</h3>
        Failed
      </div>

      <div class="card">
        <h3 class="orange">${pending}</h3>
        Pending / Skipped
      </div>

      <div class="card">
        <h3>${unknown}</h3>
        Unknown
      </div>

      <div class="card">
        <h3>${passRate}%</h3>
        Pass Rate
      </div>

      <div class="card">
        <h3>${(duration / 1000).toFixed(2)}s</h3>
        Test Duration
      </div>

    </div>

    <div class="progress">
      <span style="width:${passRate}%"></span>
    </div>

  </section>


  <section class="section">

    <h2>Detailed Test Execution Results</h2>

    <div style="overflow-x:auto">

      <table>

        <thead>

          <tr>
            <th>#</th>
            <th>Test Case</th>
            <th>Status</th>
            <th>Duration</th>
          </tr>

        </thead>

        <tbody>

          ${rows}

        </tbody>

      </table>

    </div>

  </section>


  <footer class="footer">

    B2C Supplier Portal | QA Automation Test Report

  </footer>

</div>

</body>

</html>`;

  fs.mkdirSync(outputFolder, {
    recursive: true
  });

  fs.writeFileSync(
    outputFile,
    html,
    'utf8'
  );
  console.log('-----------------------------------');
  console.log('CUSTOM HTML REPORT GENERATED');
  console.log('-----------------------------------');

  console.log(`Total tests: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Pending / Skipped: ${pending}`);
  console.log(`Pass rate: ${passRate}%`);

  console.log(`Report: ${outputFile}`);

}
try {

  generateReport();

} catch (error) {

  console.error(
    'Report generation failed:',
    error.message
  );
  process.exitCode = 1;
}
