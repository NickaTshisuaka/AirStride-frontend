describe("AirStride – Products Page", () => {
  const email = "adolfhitlure@gmail.com";
  const password = "heilhitlure99";
  const API_URL = "http://localhost:5000/api/products";

  beforeEach(() => {
    cy.clearCart(); // ✅ Ensure clean state before every test
    cy.login(email, password); // ✅ Firebase auth login (token stored in localStorage)
    cy.visit("/products");
    cy.url().should("include", "/products");
  });

  it("should display loading animation first", () => {
    cy.contains("Loading products...", { timeout: 6000 }).should("be.visible");
  });

  // it("should show error message if backend is offline or unauthorized", () => {
  //   cy.intercept("GET", API_URL, {
  //     statusCode: 401,
  //     body: {},
  //   }).as("unauth");

  //   cy.visit("/products");
  //   cy.wait("@unauth");

  //   cy.contains("Connection Error").should("be.visible");
  //   cy.contains("Not authenticated").should("exist");
  // });

  it("should show product cards when API returns valid data", () => {
    cy.intercept("GET", API_URL, {
      statusCode: 200,
      body: {
        products: [
          {
            _id: "1",
            name: "AirStride Flex Sneakers",
            price: 899.99,
            inventory_count: 10,
            image: "https://placehold.co/400x400",
            tags: ["Running", "Men", "Breathable"],
          },
          {
            _id: "2",
            name: "AirStride Elite Jacket",
            price: 1299.99,
            inventory_count: 0,
            image: "https://placehold.co/400x400",
            tags: ["Women", "Outdoor"],
          },
        ],
      },
    }).as("mockProducts");

    cy.visit("/products");
    cy.wait("@mockProducts");

    cy.get(".grid .group").should("have.length", 2);
    cy.contains("AirStride Flex Sneakers").should("be.visible");
    cy.contains("R899.99").should("be.visible");
    cy.contains("Out of Stock").should("be.visible");
  });

  it("should add a product to cart and update cart count", () => {
    cy.intercept("GET", API_URL, {
      statusCode: 200,
      body: {
        products: [
          {
            _id: "1",
            name: "AirStride Power T-Shirt",
            price: 499.99,
            inventory_count: 5,
            image: "https://placehold.co/400x400",
            tags: ["Training", "Men"],
          },
        ],
      },
    }).as("mockAddToCart");

    cy.visit("/products");
    cy.wait("@mockAddToCart");

    cy.contains("Add to Cart").click();

    // Checks if cart icon shows 1
    cy.get(".fixed.top-4.right-4 span").should("contain", "1");
  });

  // it("should persist cart in localStorage", () => {
  //   cy.window().then((win) => {
  //     const savedCart = JSON.parse(win.localStorage.getItem("cart") || "[]");
  //     expect(savedCart.length).to.be.greaterThan(0);
  //     expect(savedCart[0]).to.have.property("name");
  //     expect(savedCart[0].quantity).to.equal(1);
  //   });
  // });

  it("should show empty state when no products exist", () => {
    cy.intercept("GET", API_URL, {
      statusCode: 200,
      body: { products: [] },
    }).as("emptyProducts");

    cy.visit("/products");
    cy.wait("@emptyProducts");

    cy.contains("No products found. Add some to your MongoDB database!").should(
      "be.visible"
    );
  });
});
