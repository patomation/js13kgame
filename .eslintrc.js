module.exports = {
  extends: 'standard-with-typescript',
  parserOptions: {
    project: [
      './tsconfig.json',
      './tsconfig.test.json'
    ]
  },
  rules: {
    '@typescript-eslint/member-delimiter-style': 0
  },
  overrides: [
    {
      /* Turns off typescript rules for js files. ie webpack.config.js and node scripts */
      files: ['*.js'],
      parser: 'espree',
      extends: [
        'standard'
      ],
      rules: {
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/no-empty-function': 0
      }
    }
  ]
}
