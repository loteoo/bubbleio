import {app} from 'hyperapp'
import {init} from './app/init'
import {view} from './app/view'
import {subscriptions} from './app/subscriptions'


// Initialize the app on the document
app({
  init: {...init, ...window.initialState},
  view,
  subscriptions,
  container: document
})
