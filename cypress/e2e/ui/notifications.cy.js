import LoginPage from '../../pages/LoginPage';
import NotificationsPage from '../../pages/NotificationsPage';
describe('Supplier Notification Tests', () => {
  const loginPage = new LoginPage();
  const notificationsPage = new NotificationsPage();

  beforeEach(() => {
    loginPage.visit();

    cy.fixture('supplierLogin').then((data) => {
      loginPage.login(
        data.validUser.email,
        data.validUser.password
      );

      cy.location('pathname', { timeout: 15000 })
        .should('include', '/supplier/orders');

      notificationsPage.clickNotifications();
    });
  });

  it('TC01 - should display the Notifications page', () => {
    notificationsPage.verifyNotificationsPage();
  });

  it('TC02 - should display order cancellation notifications', () => {
    notificationsPage.verifyNotificationsExist();
    cy.contains(/cancel/i).should('be.visible');
  });

it('TC03 - should show the Mark all as read control', () => {
  notificationsPage.verifyNotificationsPage();

  cy.contains('button', 'Mark all as read')
    .should('be.visible');
});
it('TC04 - should display notification details when a notification exists', () => {
  notificationsPage.verifyNotificationsPage();
  cy.get('body').then(($body) => {
    const rows = $body.find('tbody tr:not(.animate-pulse)');

    if (rows.length > 0 && !$body.text().includes('No notifications.')) {
      cy.get('tbody tr:not(.animate-pulse)').first().should('be.visible');
    } else {
      cy.contains('No notifications.').should('be.visible');
    }
  });
});
it('TC05 - should show the Clear all control', () => {
  notificationsPage.verifyNotificationsPage();
  cy.contains('button', 'Clear all')
    .should('be.visible');
});
})
