import {app} from 'hyperapp'
import {init as defaultState} from './app/init'
import {view} from './app/view'
import {subscriptions} from './app/subscriptions'

import {ParseUrl} from './app/actions'

import {enableOnMountDomEvent} from './utils'

enableOnMountDomEvent()

// Build the client-side initial state
const init = ParseUrl({
  ...defaultState,
  ...window.initialState
}, window.location.pathname)


// Initialize the app on the document
app({init, view, subscriptions, container: document})
