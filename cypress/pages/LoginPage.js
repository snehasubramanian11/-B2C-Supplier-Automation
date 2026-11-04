class LoginPage {
  emailInput = 'input[type="email"]';
  passwordInput = 'input[type="password"]';
  loginButton = 'button[type="submit"]';
  visit() {
    cy.visit('/login/supplier');
  }

  enterEmail(email) {
    cy.get(this.emailInput).clear();

    if (email !== '') {
      cy.get(this.emailInput).type(email);
    }
  }
  enterPassword(password) {
    cy.get(this.passwordInput).clear();

    if (password !== '') {
      cy.get(this.passwordInput).type(password);
    }
  }
  clickLogin() {
    cy.get(this.loginButton).click();
  }
  login(email, password) {
    this.enterEmail(email);
    this.enterPassword(password);
    this.clickLogin();
  }
  verifySuccessfulLogin() {
    cy.location('pathname', { timeout: 15000 })
      .should('include', '/supplier/orders');
  }

  verifyLoginPage() {
    cy.location('pathname')
      .should('include', '/login/supplier');
  }
}
export default LoginPage;
