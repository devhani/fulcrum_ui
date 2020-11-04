module.exports = {
  plugins: [
    [
      'add-module-exports',
      {
        'addDefaultProperty': true
      }
    ],
  ],
  presets: [
    [
      '@babel/env',
      {
        modules: 'commonjs',
        useBuiltIns: 'usage',
        corejs: 3
      }
    ],
    '@babel/typescript',
    '@babel/react'
  ]
}
