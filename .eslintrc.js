module.exports = {
  root: true,
  extends: 'airbnb',
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    strict: 0,

    'no-unused-vars': 0,

    'no-useless-escape': 0,

    'no-restricted-syntax': 0,

    'no-return-assign': 0,

    'no-plusplus': 0,

    'operator-assignment': 0,

    'consistent-return': 0,

    'default-case': 0,

    'lines-around-comment': [
      'error', {
        beforeLineComment: true,
        allowBlockStart: true,
        allowObjectStart: true,
        allowArrayStart: true,
      },
    ],

    // Otherwise there is syntax errors, without newest babel.
    'comma-dangle': [
      'error', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],
  },
};
