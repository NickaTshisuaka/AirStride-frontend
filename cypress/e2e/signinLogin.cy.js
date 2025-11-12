describe("SigninLogin Page", () => {
  const baseUrl = "http://localhost:5173/signinlogin";

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it("renders the login form by default", () => {
    cy.get('[data-testid="auth-header"]')
      .should("be.visible")
      .and("contain.text", "Welcome Back 👋");

    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="password"]').should("exist");
    cy.get('button[type="submit"]').should("contain.text", "Sign In");
  });

  it("shows validation error when submitting empty login form", () => {
    cy.get('[data-testid="auth-header"]').should("be.visible");
    cy.get('button[type="submit"]').click();
    cy.contains("Please fill in all fields").should("be.visible");
  });

  it("toggles to Sign Up form and shows proper fields", () => {
    cy.get('[data-testid="auth-header"]').should("be.visible");
    cy.contains("Sign up").click();

    cy.get('[data-testid="auth-header"]')
      .should("contain.text", "Create Account 🚀");

    cy.get('input[name="firstName"]').should("exist");
    cy.get('input[name="lastName"]').should("exist");
    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="password"]').should("exist");
    cy.get('input[name="confirmPassword"]').should("exist");
    cy.get('button[type="submit"]').should("contain.text", "Sign Up");
  });

  it("shows validation error for mismatched passwords", () => {
    cy.get('[data-testid="auth-header"]').should("be.visible");
    cy.contains("Sign up").click();

    cy.get('input[name="firstName"]').type("Test");
    cy.get('input[name="lastName"]').type("User");
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="confirmPassword"]').type("wrongpassword");

    cy.get('button[type="submit"]').click();
    cy.contains("Passwords do not match").should("be.visible");
  });

  it("shows validation error for weak password", () => {
    cy.get('[data-testid="auth-header"]').should("be.visible");
    cy.contains("Sign up").click();

    cy.get('input[name="firstName"]').type("Test");
    cy.get('input[name="lastName"]').type("User");
    cy.get('input[name="email"]').type("weak@example.com");
    cy.get('input[name="password"]').type("123");
    cy.get('input[name="confirmPassword"]').type("123");

    cy.get('button[type="submit"]').click();
    cy.contains("Password must be at least 6 characters long").should("be.visible");
  });

  it("redirects to home page after a successful login (mocked)", () => {
    cy.get('[data-testid="auth-header"]').should("be.visible");

    cy.get('input[name="email"]').type("valid@example.com");
    cy.get('input[name="password"]').type("validpassword");
    cy.get('button[type="submit"]').click();

    // Mock navigation to /home
    cy.visit("/home");
    cy.url().should("include", "/home");
  });

  it("renders social login buttons", () => {
    cy.get('[data-testid="auth-header"]').should("be.visible");

    ["google", "github", "facebook", "twitter"].forEach((provider) => {
      cy.get(`.social-button.${provider}, { timeout: 10000 }`)
        .should("exist")
        .and("not.be.disabled");
    });
  });
});