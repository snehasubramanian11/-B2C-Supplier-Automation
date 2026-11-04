
class NotificationsPage {
  notificationRows = 'tbody tr';
  loadingRows = 'tr.animate-pulse';
  clickNotifications() {
    cy.contains('Notifications').click();
    cy.location('pathname', { timeout: 15000 })
      .should('include', '/supplier/notifications');
  }
  waitForNotificationsToLoad() {
    cy.contains('h1', 'Notifications', { timeout: 15000 })
      .should('be.visible');
    cy.get(this.loadingRows).should('not.exist');
  }
  verifyNotificationsPage() {
    this.waitForNotificationsToLoad();
    cy.contains('Notification').should('be.visible');
    cy.contains('Date').should('be.visible');
    cy.contains('Status').should('be.visible');

    cy.contains('button', 'Mark all as read').should('be.visible');
    cy.contains('button', 'Clear all').should('be.visible');
  }
  verifyNotificationsExist() {
    this.waitForNotificationsToLoad();

    cy.get('body').then(($body) => {
      const bodyText = $body.text();

      if (bodyText.includes('No notifications.')) {
        cy.contains('No notifications.').should('be.visible');
      } else {
        cy.get(this.notificationRows)
          .should('have.length.greaterThan', 0);
      }
    });
  }
  verifyNotificationDetails(message, orderNumber, date, status) {
    this.waitForNotificationsToLoad();

    cy.contains(this.notificationRows, message)
      .should('be.visible')
      .within(() => {
        cy.contains(orderNumber).should('be.visible');
        cy.contains(date).should('be.visible');
        cy.contains(status).should('be.visible');
      });
  }
  clickMarkAllAsRead() {
    cy.contains('button', 'Mark all as read')
      .should('be.enabled')
      .click();
  }
  verifyAllNotificationsRead() {
    this.waitForNotificationsToLoad();

    cy.get(this.notificationRows)
      .each(($row) => {
        cy.wrap($row).should('contain.text', 'Read');
      });
  }
  clickClearAll() {
    cy.contains('button', 'Clear all')
      .should('be.enabled')
      .click();
  }
  verifyAllNotificationsCleared() {
    cy.contains('No notifications.', { timeout: 10000 })
      .should('be.visible');
  }
  verifyNoNotifications() {
    this.waitForNotificationsToLoad();
    cy.contains('No notifications.').should('be.visible');
  }
}
export default NotificationsPage;
