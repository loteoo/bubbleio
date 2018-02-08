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

// Join appropriate socket rooms on load
if (state.currentBubble) {
  socket.emit('switch room', {
    prevRoomId: null,
    nextRoomId: state.currentBubble._id
  });
  console.log("join room: " + state.currentBubble._id);
}
if (state.currentThread) {
  socket.emit('join thread', state.currentThread);
  console.log("join thread: " + state.currentThread._id);
}



// ======================================================================
// Received event handlers
// ======================================================================


window.socket.on('update state', newState => main.updateState(newState));
