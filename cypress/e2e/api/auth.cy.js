describe('B2B Supplier Authentication API', () => {
  const loginUrl =
    'https://b2cqa.bufferbytes.in/authentication/supplier/login/';

  it('TC01 - should login successfully with valid credentials', () => {
    cy.env(['SUPPLIER_EMAIL', 'SUPPLIER_PASSWORD'])
      .then(({ SUPPLIER_EMAIL, SUPPLIER_PASSWORD }) => {

        return cy.request({
          method: 'POST',
          url: loginUrl,
          body: {
            email: 'supplier@gmail.com',
            password: 'octopus123'
          }
        });
      })
      .then((response) => {

        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('access');
        expect(response.body).to.have.property('refresh');
        expect(response.body).to.have.property('user');
        expect(response.body.access).to.be.a('string').and.not.be.empty;

        cy.log('Supplier login successful');
      });
  });

  it('TC02 - should reject invalid password', () => {

      cy.env(['SUPPLIER_EMAIL'])
      .then(({ SUPPLIER_EMAIL }) => {
        return cy.request({
          method: 'POST',
          url: loginUrl,
          body: {
            email: SUPPLIER_EMAIL,
            password: 'WrongPassword123'
          },
          failOnStatusCode: false
        });
      })
      .then((response) => {

        expect(response.status).to.be.oneOf([400, 401, 403]);
        expect(response.body).not.to.have.property('access');

        cy.log('Invalid password was rejected');
      });
  });

  it('TC03 - should reject invalid email', () => {
    cy.env(['SUPPLIER_PASSWORD'])
      .then(({ SUPPLIER_PASSWORD }) => {
        return cy.request({
          method: 'POST',
          url: loginUrl,
          body: {
            email: 'WrongEmail',
            password: SUPPLIER_PASSWORD
          },
          failOnStatusCode: false
        });
      })
      .then((response) => {

        expect(response.status).to.be.oneOf([400, 401, 403]);
        expect(response.body).not.to.have.property('access');
        cy.log('Invalid email was rejected');
      });
  });

  it('TC04 - should reject empty login fields', () => {
    cy.request({
      method: 'POST',
      url: loginUrl,
      body: {
        email: '',
        password: ''
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 401, 403, 422]);
    });
  });
});
