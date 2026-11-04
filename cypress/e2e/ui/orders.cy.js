
import LoginPage from '../../pages/LoginPage';
import OrdersPage from '../../pages/OrdersPage';

describe('Supplier Orders Module', () => {

  const loginPage = new LoginPage();
  const ordersPage = new OrdersPage();

 
  beforeEach(() => {

   
    cy.intercept(
      'POST',
      '**/authentication/supplier/login/**'
    ).as('supplierLogin');

    cy.fixture('supplierLogin').then((data) => {

      cy.visit('/login/supplier');

      loginPage.login(
        data.validUser.email,
        data.validUser.password
      );

      cy.wait('@supplierLogin').then((interception) => {

        expect(interception.response).to.exist;
        expect(interception.response.statusCode).to.eq(200);

        cy.log('Supplier login API successful');

      });

      cy.url({ timeout: 15000 })
        .should('include', '/supplier/orders');

    });

  });

  
  it('TC01 - Should verify the Orders dashboard', () => {

    ordersPage.verifyDashboard();

  });

 
  it('TC02 - Should click the Unfulfilled tab', () => {

    ordersPage.clickUnfulfilled();

    cy.contains('Unfulfilled').should('be.visible');

  });

  it('TC03 - Should click the Completed tab', () => {

    ordersPage.clickCompleted();

    cy.contains('Completed').should('be.visible');

  });

  it('TC04 - Should search for an order', () => {

    ordersPage.searchOrder('1001');

    cy.get('input[placeholder*="search" i]')
      .should('be.visible')
      .and('have.value', '1001');

  });


  it('TC05 - Should clear the order search', () => {

    ordersPage.searchOrder('1001');

    ordersPage.clearOrderSearch();

    cy.get('input[placeholder*="search" i]')
      .should('be.visible')
      .and('have.value', '');

  });
  it('TC06 - Should display Notifications', () => {

    ordersPage.clickNotifications();

    cy.contains('Notifications').should('be.visible');

  });

});
