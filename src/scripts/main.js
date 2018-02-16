// Websocket connect
window.socket = io.connect(window.location.host);


// Load our hyperapp
import {app} from 'hyperapp'
import {location} from "@hyperapp/router"
import {state} from './state/'
import {actions} from './actions/'
import {view} from './views/'



// Start hyperapp
window.main = app(state, actions, view, document.querySelector("main"));

// Activate our router
const unsubscribe = location.subscribe(main.location);



// External state update handler
window.socket.on('update state', newState => main.updateState(newState));



// Activate service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
  .register('/sw.js')
  .then(function() { console.log('Service Worker Registered'); });
}
