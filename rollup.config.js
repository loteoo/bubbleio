import jsx from 'rollup-plugin-jsx'

export default {
  input: 'src/scripts/main.js',
  output: {
    file: 'build/js/main.min.js',
    format: 'iife'
  },
  plugins: [
    require('rollup-plugin-node-resolve')({
      browser: true,
      main: true
    }),
    jsx( {factory: 'h'} ),
  ]
};
