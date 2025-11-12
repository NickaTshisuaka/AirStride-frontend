// cypress.config.js
import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "64ertr",
  e2e: {
    baseUrl: "http://localhost:5173",
    supportFile: "cypress/support/e2e.js",
    testIsolation: false,
    experimentalStudio: true,
    defaultCommandTimeout: 900,
    requestTimeout: 65000,
    responseTimeout: 65000,
    viewportWidth: 1920,
    viewportHeight: 1080,
  },
  env: {
    VITE_FIREBASE_API_KEY: "AIzaSyBNLdaEczydjojg_s4YsY5F9xc14PtC9Ks",
  },
});
