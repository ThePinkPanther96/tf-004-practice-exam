import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist/client",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("/node_modules/") &&
            ["/@shikijs/", "/shiki/", "/oniguruma", "/regex"].some((name) =>
              id.includes(name),
            )
          )
            return "syntax";
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": "http://127.0.0.1:3001",
      "/sources": "http://127.0.0.1:3001",
    },
  },
});
