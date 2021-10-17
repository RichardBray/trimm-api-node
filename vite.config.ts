import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";
import { PORT } from "./src/config";

export default defineConfig({
  server: {
    port: (PORT as number) || 3000,
  },
  plugins: [
    ...VitePluginNode({
      adapter: "express",
      appPath: "./src/index.ts",
      exportName: "viteNodeApp",
      tsCompiler: "esbuild",
    }),
  ],
});
