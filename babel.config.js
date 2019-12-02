// require("@babel/register")({
//     ignore: [/node_modules\/(?!lodash-es)/],
// });
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
  sourceType: "module",
  plugins: [
    "@babel/plugin-proposal-class-properties",
    // ["@babel/plugin-transform-modules-commonjs", {
    //   "allowTopLevelThis": true
    // }],
  ],
  // ignore: [
  //   "node_modules/@babel/plugin-proposal-class-properties/lib/index.js",
  // ]
};
