module.exports = {
	root: true,
	env: {
		node: true,
		es2021: true
	},
	extends: ['eslint:recommended', 'prettier'],
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module'
	},
	plugins: [],
	rules: {
		// General rules
		'no-console': 'warn'
	},
	ignorePatterns: [
		'dist/**',
		'node_modules/**',
		'**/*.js',
		'!**/.eslintrc.js'
	],
	overrides: [
		{
			files: ['**/*.ts'],
			extends: ['./.eslintrc.typescript.js']
		}
	]
};
