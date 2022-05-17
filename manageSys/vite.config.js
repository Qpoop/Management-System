import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
const resolve = (dir) => path.resolve(__dirname, dir);

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve("src"),
      comps: resolve("src/components"),
      api: resolve("src/api"),
      views: resolve("src/views"),
      utils: resolve("src/utils"),
      router: resolve("src/router"),
      config: resolve("src/config"),
    },
  },
  server: {
    host: "localhost",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
      },
    },
  },
  plugins: [vue()],
});
