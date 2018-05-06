// Websocket connect
window.socket = io.connect(window.location.host);


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
const unsubscribe = location.subscribe(main.location);


// Login on load (sets a username on our socket connection)
if (state.user._id) {
  socket.emit('login', {
    username: state.user.username
  });
}


// Manage socket.io events
window.socket.on('update state', newState => main.updateState(newState));

window.socket.on('delete bubble', bubble => main.deleteBubble(bubble));

window.socket.on('delete thread', thread => main.deleteThread(thread));

window.socket.on('redirect', pathname => main.location.go(pathname));


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
