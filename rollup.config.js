import jsx from 'rollup-plugin-jsx'

export default {
  input: 'src/main.js',
  output: {
    file: 'public/js/main.min.js',
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
