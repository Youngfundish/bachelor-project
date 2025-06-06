describe('Solution creation flow', () => {

    beforeEach(() => {
      // Login before each test
      cy.visit('http://localhost:3000/login');
  
      cy.get('input[name="email"]').type('john5@test.com');
      cy.get('input[name="password"]').type('Ab123&');
      cy.get('button[type="submit"]').click();
  
      cy.url({ timeout: 5000 }).should('not.include', '/login');
    });
  
    it('should create a new solution', () => {
      cy.visit('http://localhost:3000/solutions/new');
  
      cy.get('input[name="name"]').type('Test Solution');
      cy.get('textarea[name="description"]').type('This is a test solution description.');
      cy.get('input[name="location"]').type('Test Location');
      cy.get('textarea[name="problem"]').type('Test problem');
      
      // Solution details
      cy.get('input[name="solutionDetails.title"]').type('Solution Title');
      cy.get('textarea[name="solutionDetails.description"]').type('Solution description');
      cy.get('textarea[name="solutionDetails.rootCause"]').type('Root cause');
      cy.get('textarea[name="solutionDetails.countermeasure"]').type('Countermeasure');
  
      cy.get('button[type="submit"]').click();
  
      // check for redirect or success toast
      cy.url({ timeout: 5000 }).should('include', '/solutions');
    });
  
  });
  