module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json', '.web.js', '.web.tsx'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@utils': './src/utils',
          '@types': './src/types',
          '@contexts': './src/contexts'
        }
      }
    ]
  ]
};
