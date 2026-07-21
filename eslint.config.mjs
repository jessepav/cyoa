import { defineConfig } from "/opt/NodeJS/npm-global/lib/node_modules/eslint/lib/config-api.js";
import globals from '/opt/NodeJS/npm-global/lib/node_modules/globals/index.js';
import js from "/opt/NodeJS/npm-global/lib/node_modules/@eslint/js/src/index.js";

export default defineConfig([
    {
        files: ["**/*.mjs"],
        plugins: {
            js,
        },
        extends: ["js/recommended"],
        rules: {
            // The values are "error", "warn", and "off"
            "semi": "warn",
            "no-undef": "warn",
            "no-fallthrough": "off",
            "no-unused-vars": "off",
            "no-unused-labels": "off",
            "no-case-declarations": "off",
            "no-useless-escape": "off",
            "no-trailing-spaces": "warn",
            "no-debugger": "warn",
        },
        languageOptions: {
            globals: {
                ...globals.browser,
            }
        },
    },
    {
        ignores: ["lib/"]
    },
]);

