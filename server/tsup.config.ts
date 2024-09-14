import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: ['src/index.ts'],
  format: ['esm'],
  minify: true,
  clean: true,
  bundle: true,
  splitting: true,
  target: 'esnext',
  outDir: 'build',
  shims: true,
})