
import 'normalize.css'
import './main.css'

// Load our hyperapp
import {app} from 'hyperapp'
import {location} from "@hyperapp/router"
import {state} from './state/'
import {actions} from './actions/'
import {view} from './views/'
import {onKeyDown} from './utils/'


// Start hyperapp
window.main = app(state, actions, view, document.body);

// Activate our router
window.unsubscribe = location.subscribe(main.location);

// // Websocket connect
// window.socket = io.connect(window.location.host);
//
// // Login on load (sets a username on our socket connection)
// if (state.user._id) {
//   socket.emit('login', {
//     username: state.user.username
//   });
// }
//



// Handle keyboard events
document.onkeydown = onKeyDown;

// // Activate the service worker
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', function() {
//     navigator.serviceWorker.register('/sw.js').then(function(registration) {
//       // Registration was successful
//       console.log('ServiceWorker registration successful with scope: ', registration.scope);
//     }, function(err) {
//       // registration failed :(
//       console.log('ServiceWorker registration failed: ', err);
//     });
//   });
// }
