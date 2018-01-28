// Websocket connect
var socket = io.connect(window.location.host );

// Start hyperapp
const { h, app } = hyperapp
window.main = app(state, actions, view, document.querySelector("main"));





// ======================================================================
// Received event handlers
// ======================================================================

socket.on('new message', function(message) {
  main.receiveMessage(message);
});









// ======================================================================
// TODO: Navigation jumbo, probably needs better integration with hyperapp
// ======================================================================

var currentView = state.currentView

document.addEventListener('keydown', function(event) {
  if (event.keyCode == 37 || event.keyCode == 39) {
    if(event.keyCode == 37) {
      destination = getDestination("right");
    } else if(event.keyCode == 39) {
      destination = getDestination("left");
    }
    if (destination != currentView) {
      main.navigate({destination: destination})
      currentView = destination
    }
  }
});

// Figure out the wanted view from the swipe direction and current view
function getDestination(direction) {
  if (currentView == "bubbleView") {
    if (direction == "right") {
      return "globalView"
    } else if (direction == "left") {
      return "threadView"
    }
  } else if (currentView == "threadView" && direction == "right") {
    return "bubbleView"
  } else if (currentView == "globalView" && direction == "left") {
    return "bubbleView"
  }
  return currentView
}
