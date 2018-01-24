
const { h, app } = hyperapp



// Test data - user account
var user = {
  username: "loteoo",
  created: "2018-01-23 21:38:09"
}


// Test data - global view (bubble list)
var allBubbles = [
  {
    id: "csgo",
    name: "CS:GO",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    created: "2018-01-23 21:38:09"
  },
  {
    id: "potatoes",
    name: "Potato group",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    created: "2018-01-23 21:38:09"
  },
  {
    id: "webdev",
    name: "Web developpment",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    created: "2018-01-23 21:38:09"
  },
  {
    id: "testory",
    name: "Test bubble",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    created: "2018-01-23 21:38:09"
  }
]



// Test data - bubble view (thread list)
var bubble = {
  id: "testory",
  name: "Test bubble",
  desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  created: "2018-01-23 21:38:09",
  threads: [
    {
      id: 232,
      name: "My new car",
      score: 21,
      created: "2018-01-23 21:38:09",
      content: {
        type: "image",
        url: "https://i.redd.it/mcljmha8ufb01.jpg"
      }
    },
    {
      id: 232,
      name: "Hey watsup guys its the boi here",
      score: 25,
      created: "2018-01-23 21:38:09",
      content: {
        type: "text",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      }
    },
    {
      id: 232,
      name: "Some youtube video",
      score: 12,
      created: "2018-01-23 21:38:09",
      content: {
        type: "youtube",
        url: "https://www.youtube.com/watch?v=3BJU2drrtCM"
      }
    }
  ]
}



// Test data - thread view (message list)
var thread = {
  id: 232,
  name: "Hey watsup guys its the boi here",
  score: 25,
  content: {
    type: "text",
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  messages: [
    {
      sender: "loteoo",
      message: "Test message hello hello",
      created: "2018-01-23 21:38:09"
    },
    {
      sender: "asdasd",
      message: "message das das das dasd asd  hello",
      created: "2018-01-23 21:38:09"
    },
    {
      sender: "tototo",
      message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor inc",
      created: "2018-01-23 21:38:09"
    }
  ]
}













// ==============
// Components
// ==============

const bubbleItem = ({ id, name, desc, created }) => (
  h("li", { created: created }, name)
)

const threadItem = ({ id, name, score, content, created }) => (
  h("li", { created: created }, name)
)

const messageItem = ({ sender, message, created }) => (
  h("li", { created: created }, message)
)




















const state = {
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
      h("h2", {}, "My bubbles"),
      h("ul", { class: "bubbles" }, state.allBubbles.map(bubbleItem))
    ]),
    h("div", { class: "bubble-view" }, [
      h("h2", {}, "Bubble view"),
      h("ul", { class: "threads" }, state.bubble.threads.map(threadItem))
    ]),
    h("div", { class: "thread-view" }, [
      h("h2", {}, "My new car"),
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
    console.log(currentView);
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
