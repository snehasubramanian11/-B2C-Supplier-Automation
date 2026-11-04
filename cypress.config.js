
const { defineConfig } = require('cypress');

module.exports = defineConfig({

  video: true,
  screenshotOnRunFailure: true,

  reporter: 'cypress-mochawesome-reporter',

  reporterOptions: {
    reportDir: 'cypress/reports/mochawesome',
    reportPageTitle: 'B2C Supplier QA Test Execution Report',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    videoOnFailOnly: true,
    overwrite: false,
    html: true,
    json: true,
    saveJson: true
  },

  env: {
    PROJECT_NAME: 'B2C Supplier Portal',
    TESTER: 'Your Name',
    TEST_ENVIRONMENT: 'QA',
    APPLICATION_URL: 'https://octopus-package-dashboard.vercel.app',
    API_URL: 'https://b2cqa.bufferbytes.in',
    BROWSER_NAME: 'Chrome',
    TEST_TYPE: 'Automation Testing',
    FRAMEWORK: 'Cypress 16.2.1'
  },

  e2e: {
    baseUrl: 'https://octopus-package-dashboard.vercel.app',

    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    }
  }

});
