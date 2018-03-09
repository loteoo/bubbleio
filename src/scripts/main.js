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



// Manage socket.io events
window.socket.on('update state', newState => main.updateState(newState));

window.socket.on('remove bubble', bubble => main.removeBubble(bubble));

window.socket.on('remove thread', thread => main.removeThread(thread));



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
