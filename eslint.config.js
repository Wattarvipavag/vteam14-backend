import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        languageOptions: {
            globals: globals.node,
            parserOptions: {
                sourceType: 'module', // Enable ES6 modules if using import/export
            },
        },
        rules: {
            indent: ['error', 4], // Enforces 4 spaces for indentation
            semi: ['error', 'always'], // Enforce semicolons
            quotes: ['error', 'single'], // Enforce single quotes for strings
            'no-unused-vars': 'warn', // Warn about unused variables
            'prefer-const': 'error', // Prefer 'const' over 'let' when variables are not reassigned
            eqeqeq: 'error', // Enforce strict equality (===) instead of ==
        },
    },
    pluginJs.configs.recommended,
];
