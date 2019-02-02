import {app} from 'hyperapp'
import {init} from './app/init'
import {view} from './app/view'

// Initialize the app on the document
app({
  init: {...init, ...window.initialState},
  view,
  subscriptions: console.log,
  container: document
})