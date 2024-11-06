module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {},
  extends: ['plugin:nuxt/recommended'],
  plugins: [],
  // add your custom rules here
  rules: {
    'vue/no-v-html': 'off',
  },
};
