import {h} from 'hyperapp'
import {timeSince} from '../utils/'




const bubbleItem = ({ id, name, title, desc }) => h("li", { onclick: () => main.navigate({destination: "bubbleView", bubbleName: name}) }, title)



const bubbleViewComponent = (state, actions, bubble) => {
  if (bubble) {
    return h("div", { class: "bubble-view" }, [
      h("div", { class: "frame" }, [
        h("div", { class: "bubble-header" }, [
          h("div", { class: "back", onclick: () => actions.navigate({destination: "globalView"}) }),
          h("h2", {}, bubble.title)
        ]),
        h("ul", { class: "threads" }, bubble.threads.map(thread => threadItem(thread, bubble))),
        keyboardComponent(state, actions)
      ])
    ])
  }
}



const threadItem = (thread, bubble) => {
  let contentView;
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
      h("p", {}, "by " + thread.author + " on " + bubble.name + " " + timeSince(thread.created))
    ]),
    contentView,
    h("div", { class: "thread-footer" }, [
      h("div", { class: "info" }, 8 + " in this thread"),
      h("button", { class: "upvote", onclick: (e) => { e.stopPropagation(); main.upvote(thread); } }, thread.score)
    ])
  ])
}



const threadViewComponent = (state, actions, thread) => {
  if (thread) {
    return h("div", { class: "thread-view" }, [
      h("div", { class: "frame" }, [
        h("div", { class: "thread-header" }, [
          h("div", { class: "back", onclick: () => actions.navigate({destination: "bubbleView"}) }),
          h("h2", {}, thread.title)
        ]),
        h("ul", { class: "messages" }, thread.messages.map(message => messageItem(message, state))),
        keyboardComponent(state, actions)
      ])
    ])
  }
}




const messageItem = ({ sender, message, created }, state) => {
  let provenance;
  if (sender == state.username) {
    provenance = "sent"
  } else {
    provenance = "received"
  }
  return h("li", { class: provenance }, [
    h("div", { class: "content" }, message),
    h("div", { class: "info" }, sender + " " + timeSince(created))
  ])
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



export const view = (state, actions) => {

  // If logged in
  if (state.username) {


    if (!state.currentBubbleName) {
      state.currentBubbleName = "patapoufs"
    }

    let currentBubble = state.bubbles.find(bubble => bubble.name === state.currentBubbleName); // TODO: DO THIS BETTER MORE OPTIMISATIONATION
    let currentThread = currentBubble.threads.find(thread => thread.id === state.currentThreadId); // TODO: DO THIS BETTER MORE OPTIMISATIONATION



    return h("div", { class: "slider " + state.currentView }, [
      h("div", { class: "global-view" }, [
        h("div", { class: "frame" }, [
          h("h2", {}, state.username),
          h("ul", { class: "bubbles" }, state.bubbles.map(bubbleItem))
        ])
      ]),
      bubbleViewComponent(state, actions, currentBubble),
      threadViewComponent(state, actions, currentThread)
    ])

  } else {
    return h("form", { class: "loginForm" }, [
      h("h2", {}, "Chose a name"),
      h("input", { type: "text" })
    ])
  }
}
