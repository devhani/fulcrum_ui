const path = require('path')

module.exports = {
  exampleMode: 'expand',
  title: 'BZX UI Framework',
  skipComponentsWithoutExample: true,
  require: [
    path.resolve(__dirname, './setup.js'),
    path.resolve(__dirname, 'src/styles/index.scss')
  ],
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
      ]
    }
  },
  assetsDir: ['src/assets'],
  styles: {
    StyleGuide: {
      '@global body': {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
      }
    }
  },
  sections: [
    {
      name: 'Introduction',
      content: 'docs/introduction.md',
    },
    {
      name: 'Style Guide',
      content: 'docs/styleguide.md',
      components: 'docs/components/*.js',
    },
    {
      name: 'UI Components',
      content: 'src/components/components.md',
      components: 'src/components/*.js',
      exampleMode: 'collapse', // 'hide' | 'collapse' | 'expand'
      usageMode: 'collapse', // 'hide' | 'collapse' | 'expand'
    }
  ]
}
