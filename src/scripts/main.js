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
const unsubscribe = location.subscribe(main.location)



// ======================================================================
// Received event handlers
// ======================================================================

window.socket.on('new message', message => main.receiveMessage(message));

window.socket.on('update bubble user counts', bubblesData => main.updateBubbleUserCounts(bubblesData));

window.socket.on('update thread user count', threadData => main.updateThreadUserCount(threadData));
