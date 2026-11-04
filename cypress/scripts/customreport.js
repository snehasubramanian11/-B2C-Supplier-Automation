const fs = require('fs');
const path = require('path');

const inputFile = path.join(
  __dirname,
  '../reports/merged/combined-report.json'
);

const outputFile = path.join(
  __dirname,
  '../reports/merged/B2C-QA-Automation-Report.html'
);

// Tester and project details
const project = {
  name: 'B2C Supplier Portal',
  reportTitle: 'QA Automation Test Execution Report',
  tester: 'Sneha K',
  role: 'QA Intern',
  testingType: 'Functional Testing',
  environment: 'QA / Staging',
  applicationURL: 'https://octopus-package-dashboard.vercel.app',
  automationTool: 'Cypress',
  language: 'JavaScript',
  browser: 'Google Chrome'
};

// Read combined JSON
const report = JSON.parse(
  fs.readFileSync(inputFile, 'utf8')
);

const stats = report.stats || {};

const total = stats.tests || 0;
const passed = stats.passes || 0;
const failed = stats.failures || 0;
const pending = stats.pending || 0;

const passPercentage = total
  ? ((passed / total) * 100).toFixed(2)
  : '0.00';

const executionDate = stats.end
  ? new Date(stats.end).toLocaleString()
  : new Date().toLocaleString();

// Collect test details
const testCases = [];

function collectTests(suites) {

  suites.forEach(suite => {

    if (suite.tests) {

      suite.tests.forEach(test => {

        testCases.push({
          title: test.title,
          fullTitle: test.fullTitle,
          state: test.state,
          duration: test.duration,
          error: test.err?.message || ''
        });

      });

    }

    if (suite.suites) {
      collectTests(suite.suites);
    }

  });

}

(report.results || []).forEach(result => {

  collectTests(result.suites || []);

});

// Escape special HTML characters
function escapeHTML(value) {

  return String(value || '').replace(
    /[&<>"']/g,
    char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]
  );

}

// Generate test rows
const testRows = testCases.map((test, index) => {

  const status = test.state || 'pending';

  return `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHTML(test.fullTitle || test.title)}</td>
      <td class="${escapeHTML(status)}">
        ${escapeHTML(status.toUpperCase())}
      </td>
      <td>${test.duration || 0} ms</td>
      <td>${escapeHTML(test.error)}</td>
    </tr>
  `;

}).join('');

// Generate HTML
const html = `
<!DOCTYPE html>
<html>
<head>

  <meta charset="UTF-8">

  <title>${escapeHTML(project.reportTitle)}</title>

  <style>

    * {
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
      background: #f3f5f9;
      margin: 0;
      padding: 30px;
      color: #263238;
    }

    .container {
      max-width: 1200px;
      margin: auto;
    }

    .header {
      background: #172554;
      color: white;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 25px;
    }

    .header h1 {
      margin: 0 0 10px;
    }

    .header p {
      color: #bfdbfe;
    }

    .section {
      background: white;
      padding: 25px;
      border-radius: 10px;
      margin-bottom: 25px;
    }

    .details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }

    .detail {
      padding: 12px;
      background: #f3f5f9;
      border-radius: 6px;
    }

    .detail strong {
      display: block;
      margin-bottom: 5px;
      color: #475569;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
    }

    .card {
      padding: 20px;
      text-align: center;
      border-radius: 8px;
      background: #f3f5f9;
    }

    .card h2 {
      font-size: 30px;
      margin: 5px;
    }

    .passed { color: #15803d; }
    .failed { color: #dc2626; }
    .pending { color: #d97706; }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }

    th {
      background: #172554;
      color: white;
    }

    .footer {
      text-align: center;
      color: #64748b;
      margin-top: 30px;
    }

    @media(max-width: 700px) {
      .details, .summary {
        grid-template-columns: 1fr;
      }

      .section {
        overflow-x: auto;
      }
    }

  </style>

</head>

<body>

<div class="container">

  <div class="header">

    <h1>B2C SUPPLIER PORTAL</h1>

    <h2>${escapeHTML(project.reportTitle)}</h2>

    <p>Software Quality Assurance | Automation Testing</p>

  </div>

  <div class="section">

    <h2>Project Information</h2>

    <div class="details">

      <div class="detail">
        <strong>Project Name</strong>
        ${escapeHTML(project.name)}
      </div>

      <div class="detail">
        <strong>Tester</strong>
        ${escapeHTML(project.tester)}
      </div>

      <div class="detail">
        <strong>Role</strong>
        ${escapeHTML(project.role)}
      </div>

      <div class="detail">
        <strong>Testing Type</strong>
        ${escapeHTML(project.testingType)}
      </div>

      <div class="detail">
        <strong>Environment</strong>
        ${escapeHTML(project.environment)}
      </div>

      <div class="detail">
        <strong>Application URL</strong>
        <a href="${escapeHTML(project.applicationURL)}">
          ${escapeHTML(project.applicationURL)}
        </a>
      </div>

      <div class="detail">
        <strong>Automation Tool</strong>
        ${escapeHTML(project.automationTool)}
      </div>

      <div class="detail">
        <strong>Programming Language</strong>
        ${escapeHTML(project.language)}
      </div>

      <div class="detail">
        <strong>Browser</strong>
        ${escapeHTML(project.browser)}
      </div>

      <div class="detail">
        <strong>Execution Date</strong>
        ${escapeHTML(executionDate)}
      </div>

    </div>

  </div>

  <div class="section">

    <h2>Test Execution Summary</h2>

    <div class="summary">

      <div class="card">
        <h2>${total}</h2>
        Total Tests
      </div>

      <div class="card">
        <h2 class="passed">${passed}</h2>
        Passed
      </div>

      <div class="card">
        <h2 class="failed">${failed}</h2>
        Failed
      </div>

      <div class="card">
        <h2 class="pending">${pending}</h2>
        Pending
      </div>

    </div>

    <h3>Pass Percentage: ${passPercentage}%</h3>

  </div>

  <div class="section">

    <h2>Detailed Test Results</h2>

    <table>

      <thead>
        <tr>
          <th>#</th>
          <th>Test Case</th>
          <th>Status</th>
          <th>Duration</th>
          <th>Error Details</th>
        </tr>
      </thead>

      <tbody>
        ${testRows}
      </tbody>

    </table>

  </div>

  <div class="footer">

    <p>Generated using Cypress and Mochawesome</p>

    <p>B2C Supplier Portal - QA Automation</p>

  </div>

</div>

</body>
</html>
`;

// Save customized report
fs.writeFileSync(outputFile, html);

console.log('Customized QA report generated successfully!');
console.log(outputFile);