describe("Cart Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/cart");
  });

  it("should show all cart items", () => {
    cy.contains("Your Shopping Cart").should("exist");
    cy.get(".cart-item-card").should("have.length.greaterThan", 0);
  });

  it("should update quantity when + button is clicked", () => {
    cy.get(".cart-item-card").first().within(() => {
      cy.get("span").first().invoke("text").then((qty) => {
        const initialQty = parseInt(qty);
        cy.get("button").contains("+").click();
        cy.get("span").first().should("contain", initialQty + 1);
      });
    });
  });

  it("should navigate to products when Continue Shopping clicked", () => {
    cy.contains("Continue Shopping").click();
    cy.url().should("include", "/products");
  });
});
