import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: "/",
  build: {
    chunkSizeWarningLimit: 3000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ["node_modules"],
        quietDeps: true,
        // Silence legacy Sass deprecation noise from third-party packages until they migrate.
        silenceDeprecations: [
          "import",
          "global-builtin",
          "color-functions",
          "abs-percent",
        ],
      },
    },
  },
});
