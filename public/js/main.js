
const { h, app } = hyperapp



// ==============
// Components
// ==============

const bubbleItem = ({ id, name, title, desc }) => h("li", { onclick: () => main.navigate({destination: "bubbleView", bubbleName: name}) }, title)



const bubbleViewComponent = (state, actions, bubble) => {
  return h("div", { class: "bubble-view" }, [
    h("div", { class: "frame" }, [
      h("div", { class: "bubble-header" }, [
        h("div", { class: "back", onclick: () => actions.navigate({destination: "globalView"}) }),
        h("h2", {}, bubble.title)
      ]),
      h("ul", { class: "threads" }, bubble.threads.map(threadItem, bubble)),
      keyboardComponent(state, actions)
    ])
  ])
}



const threadItem = (thread, bubble) => {
  let timeString = new Date(thread.created).toLocaleString()
  if (thread.type == "message") {
    contentView = null
  } else if (thread.type == "text") {
    contentView = h("div", { class: "text" }, thread.content.text)
  } else if (thread.type == "image") {
    contentView = h("div", { class: "img", style: { "background-image": "url('"+thread.content.url+"')" } })
  } else if (thread.type == "youtube") {
    contentView = h("div", { class: "thumbnail", style: "background-image: url('"+thread.content.youtubeId+"')" })
  }
  return h("li", { class: thread.type, onclick: (e) => { main.navigate({destination: "threadView", threadId: thread.id}) }, touchstart: (e) => {console.log(e);} }, [
    h("div", { class: "thread-header" }, [
      h("h4", {}, thread.title),
      h("p", {}, "by " + thread.author + " on " + bubble.name + " at " + timeString)
    ]),
    contentView,
    h("div", { class: "thread-footer" }, [
      h("div", { class: "info" }, 8 + " in this thread"),
      h("button", { class: "upvote", onclick: (e) => { e.stopPropagation(); main.upvote(thread); } }, thread.score)
    ])
  ])
}



const threadViewComponent = (state, actions, thread) => {
  if (!thread) {
    thread = {
      title: "No Thread Selected",
      messages: []
    }
  }
  return h("div", { class: "thread-view" }, [
    h("div", { class: "frame" }, [
      h("div", { class: "thread-header" }, [
        h("div", { class: "back", onclick: () => actions.navigate({destination: "bubbleView"}) }),
        h("h2", {}, thread.title)
      ]),
      h("ul", { class: "messages" }, thread.messages.map(messageItem)),
      keyboardComponent(state, actions)
    ])
  ])
}




const messageItem = ({ sender, message, created }) => {
  if (sender == state.username) {
    provenance = "sent"
  } else {
    provenance = "received"
  }
  return h("li", { class: provenance }, message)
}



const keyboardComponent = (state, actions) => (
  h("form", { class: "keyboard", onsubmit: (e) => { actions.keyboardSubmit(e); return false } }, [
    h("div", { class: "expander " + state.keyboardStatus, onclick: () => actions.expandKeyboard(state.keyboardStatus) }, [
      h("div", { class: "text", onclick: (e) => { e.stopPropagation() } }, "txt"),
      h("div", { class: "link", onclick: (e) => { e.stopPropagation() } }, "url"),
      h("div", { class: "picture", onclick: (e) => { e.stopPropagation() } }, "pic")
    ]),
    h("input", { type: "text", value: state.keyboardVal }),
    h("button", { class: "submit", type: "submit" })
  ])
)






const state = {
  username: "loteoo",
  bubbles,
  currentView: "bubbleView",
  currentBubble: "all",
  currentThreadId: 0,
  keyboardVal: "",
  keyboardStatus: "closed"
}

const actions = {
  navigate: ({destination, bubbleName, threadId}) => {
    let state = {
      currentView: destination,
    }
    if (bubbleName) {
      state.currentBubble = bubbleName;
    }
    if (threadId) {
      state.currentThreadId = threadId;
    }
    return state;
   },
  upvote: thread => ({ score: thread.score++ }),
  expandKeyboard: status => {
    if (status == "closed") {
      return { keyboardStatus: "opened" }
    } else {
      return { keyboardStatus: "closed" }
    }
  },
  keyboardSubmit: e => {
    e.preventDefault();
    if (e.target[0].value) {
      // let timestamp = new Date().getTime(); // Milliseconds, not seconds, since epoch
      if (state.currentView == "bubbleView") {
        // Create thread and push to DB
        context.threads.push({
          id: Math.floor(Math.random()*100),
          title: e.target[0].value,
          score: 1,
          created: timestamp,
          type: "message"
        })
      } else {
        // Send message and push to DB
        context.messages.push({
          sender: state.username,
          message: e.target[0].value,
          created: timestamp
        })
      }
    }
    return false
  }
}

const view = (state, actions) => {
  // console.log(state.currentBubble);
  // console.log(state.currentThreadId);
  let bubble = state.bubbles.find(bubble => bubble.name === state.currentBubble);
  let thread = bubble.threads.find(thread => thread.id === state.currentThreadId);
  return h("div", { class: "slider " + state.currentView }, [
    h("div", { class: "global-view" }, [
      h("div", { class: "frame" }, [
        h("h2", {}, state.username),
        h("ul", { class: "bubbles" }, state.bubbles.map(bubbleItem))
      ])
    ]),
    bubbleViewComponent(state, actions, bubble),
    threadViewComponent(state, actions, thread)
  ])
}

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
