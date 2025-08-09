import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
	{
		ignores: [
			'node_modules/**',
			'dist/**',
			'types/**',
			'**/*.js',
			'**/*.d.ts'
		]
	},
	{
		// Main TypeScript files
		files: ['**/*.ts'],
		ignores: ['types/**'],
		extends: [
			eslint.configs.recommended,
			...tseslint.configs.recommended,
			prettierConfig
		],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: './tsconfig.json',
				tsconfigRootDir: import.meta.dirname,
				sourceType: 'module'
			}
		},
		rules: {
			'@typescript-eslint/no-unused-vars': 'warn',
			'no-console': 'off',
			'no-async-promise-executor': 'error',
			'no-case-declarations': 'error',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/ban-types': 'off',
			'@typescript-eslint/no-var-requires': 'off',
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-this-alias': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/no-use-before-define': 'off',
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/restrict-template-expressions': 'off',
			'@typescript-eslint/require-await': 'off',
			'@typescript-eslint/no-misused-promises': 'off'
		}
	},
	{
		// Test files
		files: ['**/test/**/*.ts', '**/*.test.ts', '**/test-*.ts'],
		rules: {
			'no-console': 'off',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'no-undef': 'off'
		}
	}
);
