import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import jsdoc from 'eslint-plugin-jsdoc';
import {includeIgnoreFile} from "@eslint/compat";
import path from "node:path";
import {fileURLToPath} from "node:url";
import pluginVue from 'eslint-plugin-vue'
import {
    defineConfigWithVueTs,
    vueTsConfigs,
} from '@vue/eslint-config-typescript'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default defineConfigWithVueTs(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    includeIgnoreFile(gitignorePath),
    pluginVue.configs['flat/essential'],
    pluginVue.configs['flat/strongly-recommended'],
    vueTsConfigs.recommended,
    {
        ignores: ['pages/*.vue', 'layouts/**/*.vue'],
    },
    {
        files: ['**/*.vue'],
        rules: {
            semi: ['error', 'always'],
            "vue/multi-word-component-names": 0 // Usually a good rule but due to nuxt we take care with different directories
        }
    },
    {

        files: ['**/*.ts'],

        plugins: {
            jsdoc,
        },
        rules: {
            semi: ['error', 'always'],
            "jsdoc/check-access": 1,
            "jsdoc/check-alignment": 1,
            "jsdoc/check-indentation": 1,
            "jsdoc/check-line-alignment": 1,
            "jsdoc/check-param-names": 1,
            "jsdoc/check-template-names": 1,
            "jsdoc/check-property-names": 1,
            "jsdoc/check-syntax": 1,
            "jsdoc/check-tag-names": 1,
            "jsdoc/check-types": 1,
            "jsdoc/check-values": 1,
            "jsdoc/empty-tags": 1,
            "jsdoc/implements-on-classes": 1,
            "jsdoc/informative-docs": 1,
            "jsdoc/match-description": 1,
            "jsdoc/multiline-blocks": 1,
            "jsdoc/no-bad-blocks": 1,
            "jsdoc/no-blank-block-descriptions": 1,
            "jsdoc/no-defaults": 1,
            "jsdoc/no-multi-asterisks": 1,
            "jsdoc/no-types": 1,
            "jsdoc/no-undefined-types": 1,
            "jsdoc/require-asterisk-prefix": 1,
            "jsdoc/require-description": 1,
            "jsdoc/require-description-complete-sentence": 1,
            "jsdoc/require-example": 0,
            //"jsdoc/require-file-overview": 1,
            "jsdoc/require-hyphen-before-param-description": 1,
            "jsdoc/require-jsdoc": 1,
            "jsdoc/require-param": 1,
            "jsdoc/require-param-description": 1,
            "jsdoc/require-param-name": 1,
            "jsdoc/require-param-type": 0,
            "jsdoc/require-property": 1,
            "jsdoc/require-property-description": 1,
            "jsdoc/require-property-name": 1,
            "jsdoc/require-property-type": 1,
            "jsdoc/require-returns": 1,
            "jsdoc/require-returns-check": 1,
            "jsdoc/require-returns-description": 1,
            "jsdoc/require-returns-type": 0,
            "jsdoc/require-template": 1,
            "jsdoc/require-throws": 1,
            "jsdoc/require-yields": 1,
            "jsdoc/require-yields-check": 1,
            "jsdoc/sort-tags": 1,
            "jsdoc/tag-lines": 1,
            "jsdoc/valid-types": 1
        },
    }
);
