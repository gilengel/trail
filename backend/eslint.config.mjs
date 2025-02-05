import typescriptEslintEslintPlugin from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "**/db",
        "**/prisma",
        "**/node_modules",
        "**/coverage-e2e",
        "**/coverage-unit",
        "**/dist",
    ],
}, ...compat.extends(
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:jsdoc/recommended-typescript-error",
), {
    plugins: {
        "@typescript-eslint": typescriptEslintEslintPlugin,
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.jest,
        },

        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "module",

        parserOptions: {
            project: "./tsconfig.json",
            tsconfigRootDir: "/home/gil/Documents/Projects/trail/backend",
        },
    },

    rules: {
        "@typescript-eslint/naming-convention": ["error", {
            selector: "interface",
            format: ["PascalCase"],

            custom: {
                regex: "^I[A-Z]",
                match: false,
            },
        }],

        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "error",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/ban-ts-comment": "error",
        "@typescript-eslint/ban-types": "error",
        "no-array-constructor": "off",
        "@typescript-eslint/no-array-constructor": "error",
        "@typescript-eslint/no-duplicate-enum-values": "error",
        "@typescript-eslint/no-dynamic-delete": "error",
        "@typescript-eslint/no-extra-non-null-assertion": "error",
        "@typescript-eslint/no-invalid-void-type": "error",
        "no-loss-of-precision": "off",
        "@typescript-eslint/no-loss-of-precision": "error",
        "@typescript-eslint/no-misused-new": "error",
        "@typescript-eslint/no-namespace": "error",
        "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
        "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
        "@typescript-eslint/no-non-null-assertion": "error",
        "@typescript-eslint/no-this-alias": "error",
        "@typescript-eslint/no-unnecessary-type-constraint": "error",
        "@typescript-eslint/no-unsafe-declaration-merging": "error",
        "no-unused-vars": "error",
        "@typescript-eslint/no-unused-vars": "error",
        "no-useless-constructor": "off",
        "@typescript-eslint/no-useless-constructor": "error",
        "@typescript-eslint/no-var-requires": "error",
        "@typescript-eslint/prefer-as-const": "error",
        "@typescript-eslint/prefer-literal-enum-member": "error",
        "@typescript-eslint/prefer-ts-expect-error": "error",
        "@typescript-eslint/triple-slash-reference": "error",
        "@typescript-eslint/unified-signatures": "error",
        "jsdoc/check-indentation": 1,
        "jsdoc/check-line-alignment": 1,
        "jsdoc/check-syntax": 1,
        "jsdoc/informative-docs": 1,
        "jsdoc/match-description": 1,
        "jsdoc/no-bad-blocks": 1,
        "jsdoc/no-blank-block-descriptions": 1,
        "jsdoc/no-defaults": 1,
        "jsdoc/no-types": 1,
        "jsdoc/require-asterisk-prefix": 1,
        "jsdoc/require-description": 1,
        "jsdoc/require-description-complete-sentence": 1,
        "jsdoc/require-example": 1,
        "jsdoc/require-file-overview": 1,
        "jsdoc/require-hyphen-before-param-description": 1,
        "jsdoc/require-throws": 1,
        "jsdoc/sort-tags": 1,
    },
}];