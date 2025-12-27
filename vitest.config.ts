import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "expo-file-system/legacy": path.resolve(__dirname, "./tests/mocks/expo-file-system.ts"),
    },
  },
});
