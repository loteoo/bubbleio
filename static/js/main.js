
const { h, app } = hyperapp



// ==============
// Components
// ==============

const bubbleItem = ({ id, name, desc }) => h("li", {}, name)

const threadItem = ({ id, name, score, type, content, created, author }) => {
  let timeString = new Date(created).toLocaleString()
  if (type == "message") {
    contentView = null
  } else if (type == "text") {
    contentView = h("div", { class: "text" }, content.text)
  } else if (type == "image") {
    contentView = h("div", { class: "img", style: { "background-image": "url('"+content.url+"')" } })
  } else if (type == "youtube") {
    contentView = h("div", { class: "thumbnail", style: "background-image: url('"+content.youtubeId+"')" })
  }
  return h("li", { class: type, onclick: (e) => { main.navigate("threadView") }, touchstart: (e) => {console.log(e);} }, [
    h("div", { class: "thread-header" }, [
      h("h4", {}, name),
      h("p", {}, "by " + author + " on " + state.bubble.id + " at " + timeString)
    ]),
    contentView,
    h("div", { class: "thread-footer" }, [
      h("button", { class: "upvote", onclick: (e) => { e.stopPropagation(); main.upvote(id); } }, score)
    ])
  ])
}

const messageItem = ({ sender, message, created }) => {
  if (sender == state.user.username) {
    provenance = "sent"
  } else {
    provenance = "received"
  }
  return h("li", { class: provenance }, message)
}


const keyboard = (state) => (
  h("form", { class: "keyboard", onsubmit: (e) => { main.keyboardSubmit(e); return false } }, [
    h("div", { class: "expander " + state.keyboardStatus, onclick: () => main.expandKeyboard(state.keyboardStatus) }, [
      h("div", { class: "text", onclick: (e) => { e.stopPropagation() } }, "txt"),
      h("div", { class: "link", onclick: (e) => { e.stopPropagation() } }, "url"),
      h("div", { class: "picture", onclick: (e) => { e.stopPropagation() } }, "pic")
    ]),
    h("input", { type: "text", value: state.keyboardVal }),
    h("button", { class: "submit", type: "submit" })
  ])
)






const state = {
  user,
  allBubbles,
  bubble,
  thread,
  currentView: "bubbleView",
  keyboardVal: "",
  keyboardStatus: "closed"
}

const actions = {
  navigate: destination => state => ({ currentView: destination }),
  upvote: threadId => state => {
    state.bubble.threads.find(thread => thread.id === threadId).score++
    return true
  },
  expandKeyboard: status => state => {
    if (status == "closed") {
      return { keyboardStatus: "opened" }
    } else {
      return { keyboardStatus: "closed" }
    }
  },
  keyboardSubmit: e => state => {
    if (e.target[0].value) {
      let timestamp = new Date().getTime(); // Milliseconds, not seconds, since epoch
      if (state.currentView == "bubbleView") {
        // Create thread and push to DB
        state.bubble.threads.push({
          id: Math.floor(Math.random()*100),
          name: e.target[0].value,
          score: 1,
          created: timestamp,
          type: "message"
        })
      } else {
        // Send message and push to DB
        state.thread.messages.push({
          sender: state.user.username,
          message: e.target[0].value,
          created: timestamp
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
        keyboard(state)
      ])
    ]),
    h("div", { class: "thread-view" }, [
      h("div", { class: "frame" }, [
        h("div", { class: "thread-header" }, [
          h("div", { class: "back", onclick: () => main.navigate("bubbleView") }),
          h("h2", {}, state.thread.name)
        ]),
        h("ul", { class: "messages" }, state.thread.messages.map(messageItem)),
        keyboard(state)
      ])
    ])
  ])

window.main = app(state, actions, view, document.querySelector("main"));




















// ======================================================================
// Navigation jumbo, probably needs better integration with hyperapp
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
