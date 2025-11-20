/// <reference types="vitest" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  // Support testing both library and demo app
  const testProject = process.env['TEST_PROJECT'] === 'demo' ? 'demo' : 'ng-data-table';
  const projectPath = `projects/${testProject}`;
  const isLibrary = testProject === 'ng-data-table';

  return {
    plugins: [
      angular({
        tsconfig: mode === 'test' ? `./${projectPath}/tsconfig.spec.json` : './tsconfig.json',
      }),
      viteTsConfigPaths(),
    ],

    test: {
      globals: true,
      setupFiles: [`${projectPath}/src/test-setup.ts`],
      environment: 'jsdom',
      include: [`${projectPath}/**/*.spec.ts`],
      exclude: ['**/node_modules/**', '**/dist/**'],
      reporters: ['default'],

      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        include: [`${projectPath}/src/**/*.ts`],
        exclude: [
          `${projectPath}/src/**/*.spec.ts`,
          `${projectPath}/src/test-setup.ts`,
          ...(isLibrary ? [`${projectPath}/src/public-api.ts`] : []),
        ],
      },
    },

    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});
