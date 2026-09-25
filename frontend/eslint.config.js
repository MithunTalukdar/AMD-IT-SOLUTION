export default [
  {
    ignores: ['dist', 'node_modules', '.vite'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        browser: true,
        es2022: true,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: (await import('eslint-plugin-react')).default,
      'react-hooks': (await import('eslint-plugin-react-hooks')).default,
    },
    rules: {
      ...((await import('eslint-plugin-react')).default.configs.recommended.rules),
      ...((await import('eslint-plugin-react')).default.configs['jsx-runtime'].rules),
      ...((await import('eslint-plugin-react-hooks')).default.configs.recommended.rules),
      'react/jsx-no-target-blank': 'off',
      'react/prop-types': 'off',
    },
    settings: {
      react: {
        version: '19.1',
      },
    },
  },
];