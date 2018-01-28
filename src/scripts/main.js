// Websocket connect
window.socket = io.connect(window.location.host);


// Load our hyperapp
import {app} from 'hyperapp'
import {state} from './state/'
import {actions} from './actions/'
import {view} from './views/'



// Start hyperapp
window.main = app(state, actions, view, document.querySelector("main"));





// ======================================================================
// Received event handlers
// ======================================================================

window.socket.on('new message', function(message) {
  main.receiveMessage(message);
});
