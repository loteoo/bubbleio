
const { h, app } = hyperapp



// ==============
// Components
// ==============

const bubbleItem = ({ id, name, desc, created }) => h("li", { "data-created": created }, name)

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

const messageItem = ({ sender, message, created }) => {
  if (sender == state.user.username) {
    provenance = "sent"
  } else {
    provenance = "received"
  }
  return h("li", { class: provenance }, message)
}


const keyboard = (state, actions) => (
  h("form", { class: "keyboard", onsubmit: (e) => { actions.keyboardSubmit(e); return false } }, [
    h("input", { type: "text", value: state.inputVal }),
    h("button", { type: "submit" })
  ])
)






const state = {
  user,
  allBubbles,
  bubble,
  thread,
  currentView: "bubbleView",
  inputVal: ""
}

const actions = {
  navigate: destination => state => ({ currentView: destination }),
  keyboardSubmit: e => state => {
    if (e.target[0].value) {
      if (state.currentView == "bubbleView") {
        // also push to DB
        state.bubble.threads.push({
          id: 232,
          name: e.target[0].value,
          score: 21,
          created: "2018-01-23 21:38:09",
          type: "text",
          content: {
            text: e.target[0].value
          }
        })
      } else {
        // also push to DB
        state.thread.messages.push({
          sender: state.user.username,
          message: e.target[0].value,
          created: "2018-01-23 21:38:09"
        })
      }
    }
    return true
  }
}

const view = (state, actions) =>
  h("div", { class: "slider " + state.currentView }, [
    h("div", { class: "global-view" }, [
      h("div", { class: "frame" }, [
        h("h2", {}, state.user.username),
        h("ul", { class: "bubbles" }, state.allBubbles.map(bubbleItem))
      ])
    ]),
    h("div", { class: "bubble-view" }, [
      h("div", { class: "frame" }, [
        h("h2", {}, state.bubble.name),
        h("ul", { class: "threads" }, state.bubble.threads.map(threadItem)),
        keyboard(state, actions)
      ])
    ]),
    h("div", { class: "thread-view" }, [
      h("div", { class: "frame" }, [
        h("h2", {}, state.thread.name),
        h("ul", { class: "messages" }, state.thread.messages.map(messageItem)),
        keyboard(state, actions)
      ])
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
