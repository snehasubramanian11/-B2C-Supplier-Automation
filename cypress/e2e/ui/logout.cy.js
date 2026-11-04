
import LoginPage from '../../pages/LoginPage';
import ProfileMenuPage from '../../pages/ProfilePage';

describe('Supplier Sign Out', () => {
  const loginPage = new LoginPage();
  const profilePage = new ProfileMenuPage();

  beforeEach(() => {
    cy.visit('/login/supplier');

    cy.fixture('supplierLogin').then((data) => {
      loginPage.login(
        data.validUser.email,
        data.validUser.password
      );

      cy.url().should('include', '/supplier/orders');
    });
  });

  it('TC01 - Should sign out successfully', () => {
    profilePage.verifyProfileMenuVisible();
    profilePage.clickSignout();

    cy.location('pathname').should('include', '/login');
  });
});
