import {defineVitestConfig} from "@nuxt/test-utils/config";

export default defineVitestConfig({
    test: {
        setupFiles: './tests/setup/global.ts',
        environment: 'nuxt',
        environmentOptions: {
            nuxt: {
                domEnvironment: 'happy-dom',
                mock: {
                    intersectionObserver: true,
                },
            },
        },
        coverage: {
            include: ['**/*.ts', '**/*.vue'],
            exclude: ["*.config.ts", "**/.nuxt/**", "**/vitest**"],

            reporter: ["text", "cobertura", "html"],
            thresholds: {
                statements: 40,
                branches: 40,
                functions: 40,
                lines: 40,
            },
        },
    }
});
