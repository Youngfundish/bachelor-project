describe('Auth flow', () => {
  
    it('should log in with registered user', () => {
      cy.visit('http://localhost:3000/login');
  
      cy.get('input[name="email"]').type('john5@test.com');
      cy.get('input[name="password"]').type('Ab123&');
      
      cy.get('button[type="submit"]').click();
  
      // Example: check that we're logged in or redirected to dashboard
      cy.url({ timeout: 5000 }).should('include', '/');
    });
  
  });
  