import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'
import { copyFileSync } from 'node:fs'

// Plugin to copy styles.d.ts after build
const copyStylesDts = () => ({
  name: 'copy-styles-dts',
  buildEnd() {
    try {
      copyFileSync(
        resolve(__dirname, 'src/styles.d.ts'),
        resolve(__dirname, 'dist/styles.d.ts')
      );
      console.log('✅ Copied styles.d.ts to dist');
    } catch (error) {
      console.warn('⚠️  Could not copy styles.d.ts:', error);
    }
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Library build mode
  if (mode === 'library') {
    return {
      plugins: [
        react(),
        dts({
          insertTypesEntry: true,
          include: ['src/**/*'],
          exclude: [
            'src/**/*.test.*', 
            'src/**/*.spec.*',
            'src/utils/react19-polyfill.ts',  // Exclude polyfill from build
          ],
          copyDtsFiles: true,
        }),
        copyStylesDts(),
      ],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'QuillEditorTNBT',
          formats: ['es', 'cjs'],
          fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
        },
        rollupOptions: {
          external: [
            'react', 
            'react-dom', 
            'react/jsx-runtime',
            // Also externalize React-related packages that might cause issues
            /^react\/.*/,
            /^react-dom\/.*/,
          ],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
            },
          },
        },
        cssCodeSplit: false,
        sourcemap: true,
        // Ensure CSS is included in build
        copyPublicDir: false,
      },
    }
  }

  // Development mode
  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5125,
    },
  }
})
