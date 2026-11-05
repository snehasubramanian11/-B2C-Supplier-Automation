import LoginPage from '../../pages/LoginPage';
import ProfileMenuPage from '../../pages/ProfilePage';

describe('Supplier Profile Menu', () => {
  const loginPage = new LoginPage();
  const profileMenuPage = new ProfileMenuPage();

  beforeEach(() => {
    loginPage.visit();

    cy.fixture('supplierLogin').then((data) => {
      loginPage.login(
        data.validUser.email,
        data.validUser.password
      );

      loginPage.verifySuccessfulLogin();
    });
  });

  it('TC01 - Should verify profile menu details', () => {
    profileMenuPage.verifyProfileMenuVisible();
  });

  it('TC02 - Should click Change Password', () => {
    profileMenuPage.openProfileMenu();
    profileMenuPage.clickChangePassword();
  });

  it('TC03 - Should sign out successfully', () => {
    profileMenuPage.openProfileMenu();
    profileMenuPage.clickSignout();

    cy.location('pathname').should('include', '/login');
  });
});
