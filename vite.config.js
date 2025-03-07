import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "CopyLlmsTxt",
      fileName: (format) => `copy-llms-txt.${format}.js`,
      formats: ["es", "umd", "cjs"]
    }
  },
  rollupOptions: {
    output: {
      // Ensure exports have proper names
      exports: "named"
    },
    sourcemap: true,
    minify: "terser"
  },
  plugins: [
    // Generate declaration files
    dts({
      skipDiagnostics: false,
      logDiagnostics: true,
      include: ["src/**/*.ts"],
      outDir: "dist",
      // This is important - tells dts to emit .d.ts files directly
      staticImport: true,
      // Force type generation without using tsconfig
      compilerOptions: {
        declaration: true,
        declarationDir: "./dist",
        emitDeclarationOnly: true
      }
    })
  ]
});
