/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
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
