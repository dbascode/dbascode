module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  sourceType: 'module',
  plugins: [
    '@babel/plugin-syntax-import-meta',
    '@babel/plugin-proposal-class-properties',
  ],
};
