// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'standard',
    'plugin:prettier/recommended', // ✅ 이거 추가
  ],
  plugins: ['react', '@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off', // Vite+React는 필요 없음
    'react/prop-types': 'off', // TypeScript 쓰니까
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
