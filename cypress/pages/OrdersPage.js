class OrdersPage {
  dashboardHeading = 'h1';
  unfulfilledTab = 'Unfulfilled';
  completedTab = 'Completed';
  searchInput = 'input[placeholder*="search" i]';
  ordersMenu = 'Orders';
  notificationsMenu = 'Notifications';

  verifyDashboard() {
    cy.contains(this.dashboardHeading, 'Orders')
      .should('be.visible');

    cy.contains(this.unfulfilledTab)
      .should('be.visible');

    cy.contains(this.completedTab)
      .should('be.visible');

    cy.contains(this.notificationsMenu)
      .should('be.visible');
  }

  clickOrders() {
    cy.contains(this.ordersMenu).click();
  }

  clickUnfulfilled() {
    cy.contains(this.unfulfilledTab).click();
  }

  clickCompleted() {
    cy.contains(this.completedTab).click();
  }

 searchOrder(orderNumber) {
  cy.get(this.searchInput)
    .should('be.visible')
    .clear()
    .type(orderNumber)
    .should('have.value', orderNumber);
}

clearOrderSearch() {
  cy.get(this.searchInput)
    .should('be.visible')
    .clear()
    .should('have.value', '');
}

  clickFromDateFilter() {
    cy.contains('From').click();
  }

  clickToDateFilter() {
    cy.contains('To').click();
  }

  clickNotifications() {
    cy.contains(this.notificationsMenu).click();
  }

  openProfileMenu() {
    cy.get('[YOUR_PROFILE_SELECTOR]').click();
  }

  clickSignOut() {
    cy.contains('Sign out').click();
  }
}

export default OrdersPage;