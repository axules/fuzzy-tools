module.exports = {
  plugins: [],
  presets: [
    ['@babel/preset-env', {
      corejs: { version: '3.49', proposals: false },
      forceAllTransforms: false,
      modules: 'commonjs',
    }],
  ],
}
;
