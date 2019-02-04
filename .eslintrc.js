module.exports = {
  root: true,
  env: { browser: true, node: true },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [ 'plugin:vue/recommended' ],
  // required to lint *.vue files
  plugins: [ 'vue', 'backpack' ],
  // add your custom rules here
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/max-attributes-per-line': [ 2, {
      'singleline': 16,
      'multiline': { 'max': 8, 'allowFirstLine': false }
    }]
  }
}
