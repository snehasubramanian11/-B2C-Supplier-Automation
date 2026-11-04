import './commands';

import 'cypress-mochawesome-reporter/register';

beforeEach(function () {

  cy.env([
    'PROJECT_NAME',
    'TESTER',
    'TEST_ENVIRONMENT',
    'APPLICATION_URL',
    'API_URL',
    'TEST_TYPE',
    'FRAMEWORK'
  ]).then((details) => {

    cy.addTestContext({
      title: 'Test Execution Information',

      value: [
        `Project: ${details.PROJECT_NAME}`,
        `Tester: ${details.TESTER}`,
        `Environment: ${details.TEST_ENVIRONMENT}`,
        `Application: ${details.APPLICATION_URL}`,
        `API: ${details.API_URL}`,
        `Browser: ${Cypress.browser.name}`,
        `Framework: ${details.FRAMEWORK}`,
        `Test Type: ${details.TEST_TYPE}`
      ].join('\n')
    });

  });

});