module.exports = {
	extends: [
		// 'standard',
		// 'plugin:prettier/recommended',
		'plugin:vue/recommended'
	],
	rules: {
		quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
		'dot-location': 'property',
		'array-element-newline': ['error', { multiline: true }],
		'block-spacing': 'error',
		camelcase: 'error',
		'comma-style': ['error', 'last'],
		'function-call-argument-newline': ['error', 'consistent'],
		'function-paren-newline': ['error', 'never'],
		indent: ['error', 'tab'],
		semi: ['error', 'always'],
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
	}
};
