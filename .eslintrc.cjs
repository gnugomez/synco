/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
	root: true,
	extends: [
		'@vue/eslint-config-prettier/skip-formatting',
		'@antfu',
	],
	rules: {
		'no-tabs': ['off', { allowIndentationTabs: true }],
		'@typescript-eslint/indent': ['error', 'tab'],
	},
	overrides: [
		{
			files: ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}'],
			extends: ['plugin:cypress/recommended'],
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
	},
}
