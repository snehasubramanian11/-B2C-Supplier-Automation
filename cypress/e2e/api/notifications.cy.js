describe('B2c Supplier Notifications API', () => {
  const loginUrl =
    'https://b2cqa.bufferbytes.in/authentication/supplier/login/';
  const notificationsUrl = 'https://b2cqa.bufferbytes.in/notification/notification' ;
  let accessToken;
  beforeEach(() => {
  cy.env(['SUPPLIER_EMAIL', 'SUPPLIER_PASSWORD'])
    .then(({ SUPPLIER_EMAIL, SUPPLIER_PASSWORD }) => {
      return cy.request({
        method: 'POST',
        url: 'https://b2cqa.bufferbytes.in/authentication/supplier/login/',
        body: {
          email: 'supplier@gmail.com',
          password: 'octopus123'
        },
        failOnStatusCode: false
      });
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      accessToken = response.body.access;
    });
  })
  it('TC01 - should retrieve supplier notifications', () => {
    cy.request({
      method: 'GET',
      url: notificationsUrl,
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);


      cy.log(JSON.stringify(response.body));
      expect(response.body).to.exist;
    });
  });
  it('TC02 - should reject unauthenticated notification requests', () => {
    cy.request({
      method: 'GET',
      url: notificationsUrl,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 403]);
    });
  });
});
