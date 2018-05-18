import buble from 'rollup-plugin-buble'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import postcss from 'rollup-plugin-postcss'
import nested from 'postcss-nested'
import focus from 'postcss-focus'
import cssnext from 'postcss-cssnext'
import rucksack from 'rucksack-css'

const dev = !!process.env.ROLLUP_WATCH  // True if launched via npm start
const prod = !process.env.ROLLUP_WATCH  // True if launched via npm run build

export default {
  input: 'src/main.js',
  output: {
    file: 'public/js/app.js',
    sourcemap: dev ? 'inline' : false,
    format: 'iife'
  },
  plugins: [
    postcss({
      plugins: [
        nested(),
        focus(),
        rucksack({autoprefixer: false}),
        cssnext({warnForDuplicates: false})
      ],
      extract: 'public/css/app.css',
      minimize: prod ? true : false,
      sourceMap: dev ? 'inline' : false
    }),
    buble({ jsx: 'h' }),
    resolve({ jsnext: true }),
    commonjs(),
    prod && uglify(),
    dev && livereload('public')
  ]
}
