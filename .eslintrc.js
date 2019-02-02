module.exports = {
  'parser': 'babel-eslint',
  'plugins': [
    'fp'
  ],
  'extends': ['standard', 'plugin:fp/recommended'],
  'rules': {
    'no-unused-vars': [2, { 'varsIgnorePattern': 'h' }],
    'object-curly-spacing': [2, 'never'],
    'no-multiple-empty-lines': 0,
    'fp/no-unused-expression': 0,
    'no-use-before-define': 0,
    'operator-linebreak': 0,
    'no-unused-vars': 0,
    'padded-blocks': 0,
    'fp/no-nil': 0,
    'no-undef': 0
  }
};