import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["data/test/**/*.test.ts"],
    environment: "node",
  },
});
