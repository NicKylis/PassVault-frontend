import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,ts}",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents(on, config) {
      // here you can register node listeners, plugins, etc.
    },
  },
});
