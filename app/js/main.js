
const { h, app } = hyperapp



// ==============
// Components
// ==============

const bubbleItem = ({ id, name, desc, created }) => (
  h("li", { created: created }, name)
)

const threadItem = ({ id, name, score, type, content, created }) => {
  if (type == "text") {
    content = [
      h("p", {}, name),
      h("h6", {}, content.text)
    ]
  } else if (type == "image") {
    content = [
      h("div", { class: "img", style: { "background-image": "url('"+content.url+"')" } }),
      h("p", {}, name)
    ]
  } else if (type == "youtube") {
    content = [
      h("div", { style: "background-image: url('"+content.youtubeId+"')" }),
      h("p", {}, name)
    ]
  }
  return h("li", { class: type, "data-created": created }, content)
}

const messageItem = ({ sender, message, created }) => (
  h("li", { created: created, sender: sender }, message)
)









const state = {
  user,
  allBubbles,
  bubble,
  thread,
  currentView: "bubbleView"
}

const actions = {
  navigate: destination => state => ({ currentView: destination })
}

const view = (state, actions) =>
  h("div", { class: "slider " + state.currentView }, [
    h("div", { class: "global-view" }, [
      h("h2", {}, state.user.username),
      h("ul", { class: "bubbles" }, state.allBubbles.map(bubbleItem))
    ]),
    h("div", { class: "bubble-view" }, [
      h("h2", {}, state.bubble.name),
      h("ul", { class: "threads" }, state.bubble.threads.map(threadItem))
    ]),
    h("div", { class: "thread-view" }, [
      h("h2", {}, state.thread.name),
      h("ul", { class: "messages" }, state.thread.messages.map(messageItem))
    ])
  ])

window.main = app(state, actions, view, document.querySelector("main"));




















// ======================================================================
// Navigation jumbo, probably needs better integration with hyperapp
// ======================================================================

var currentView = state.currentView

new Swipe(document.body, function(e, direction) {
	e.preventDefault()
  destination = getDestination(direction);
  if (destination != currentView) {
    main.navigate(destination)
    currentView = destination
  }
});

document.addEventListener('keydown', function(event) {
  if (event.keyCode == 37 || event.keyCode == 39) {
    if(event.keyCode == 37) {
      destination = getDestination("right");
    } else if(event.keyCode == 39) {
      destination = getDestination("left");
    }
    if (destination != currentView) {
      main.navigate(destination)
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
