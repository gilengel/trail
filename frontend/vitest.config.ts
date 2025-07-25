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
            exclude: [
                "tests/utils.ts",
                "*.config.ts",
                "**/.nuxt/**",
                "**/vitest**",
                "**/types/dto/*",
                "**/server/api/*",
                "**/server/api/*",
                "pages/*",
            ],

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
