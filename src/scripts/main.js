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

console.log(state);



// ======================================================================
// Received event handlers
// ======================================================================

window.socket.on('new message', message => main.receiveMessage(message));

window.socket.on('update bubble user counts', newState => main.updateState(newState));

window.socket.on('update thread data', newState => main.updateState(newState));

window.socket.on('new thread', newState => main.updateState(newState));
