import {h} from 'hyperapp'
import {Link, Route} from "@hyperapp/router"
import {timeSince, isElementInViewport} from '../utils/'






const globalView = (state, actions) => (
  h("div", { class: "global-view" }, [
    h("div", { class: "frame" }, [
      h("h2", {}, state.username),
      h("ul", { class: "bubbles" }, state.bubbles.map(bubble => bubbleItem(bubble, state, actions)))
    ])
  ])
)





const bubbleItem = (bubble, state, actions) => (
  h("li", {}, [
    Link({ to: "/" + bubble.name }, bubble.title)
  ])
)



const bubbleView = (state, actions) => {
  if (state.currentBubble) {
    return h("div", { class: "bubble-view" }, [
      h("div", { class: "frame", onscroll: (ev) => { if (isElementInViewport(ev.target.lastChild)) { actions.loadMoreThreads() } } }, [
        h("div", { class: "bubble-header" }, [
          Link({ to: "/" + name, class: "back" }),
          h("h2", {}, state.currentBubble.title)
        ]),
        h("ul", { class: "threads" }, state.currentBubble.threads.map(thread => threadItem(thread, state, actions))),
        keyboardComponent(state, actions),
        h("div", { class: "loadMore" })
      ])
    ])
  }
}



const threadItem = (thread, state, actions) => {
  let contentBlock;
  if (thread.type == "message") {
    contentBlock = null
  } else if (thread.type == "text") {
    contentBlock = h("div", { class: "text" }, thread.content.text)
  } else if (thread.type == "image") {
    contentBlock = h("div", { class: "img", style: { "background-image": "url('"+thread.content.url+"')" } })
  } else if (thread.type == "youtube") {
    contentBlock = h("div", { class: "thumbnail", style: "background-image: url('"+thread.content.youtubeId+"')" })
  }
  return h("li", { class: thread.type, onclick: () => actions.location.go("/" + state.currentBubble.name + "/" + thread._id) }, [
    h("div", { class: "thread-header" }, [
      h("h4", {}, thread.title),
      h("p", {}, "by " + thread.author + " on " + state.currentBubble.name + " " + timeSince(thread.created))
    ]),
    contentBlock,
    h("div", { class: "thread-footer" }, [
      h("div", { class: "info" }, 8 + " in this thread"),
      h("button", { class: "upvote", onclick: (ev) => { ev.stopPropagation(); actions.upvote(thread); } }, thread.score)
    ])
  ])
}



const threadView = (state, actions) => {
  if (state.currentThread) {
    return h("div", { class: "thread-view" }, [
      h("div", { class: "frame" }, [
        h("div", { class: "thread-header" }, [
          Link({ to: "/" + state.currentBubble.name, class: "back"  }),
          h("h2", {}, state.currentThread.title)
        ]),
        h("ul", { class: "messages" }, state.currentThread.messages.map(message => messageItem(message, state))),
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
  h("form", { class: "keyboard", onsubmit: ev => { actions.keyboardSubmit(ev); return false } }, [
    h("div", { class: "expander " + state.keyboardStatus, onclick: () => actions.expandKeyboard(state.keyboardStatus) }, [
      h("div", { class: "text", onclick: ev => { ev.stopPropagation() } }, "txt"),
      h("div", { class: "link", onclick: ev => { ev.stopPropagation() } }, "url"),
      h("div", { class: "picture", onclick: ev => { ev.stopPropagation() } }, "pic")
    ]),
    h("input", { type: "text", value: state.keyboardVal }),
    h("button", { class: "submit", type: "submit" })
  ])
)



export const view = (state, actions) => {

  // If logged in
  if (state.username) {


    var urlparts = state.location.pathname.split("/");


    state.currentView = "globalView"

    if (urlparts[1]) {
      // Update the temp bubble object
      state.currentBubble = state.bubbles.find(bubble => bubble.name == urlparts[1]); // TODO: DO THIS BETTER MORE OPTIMISATIONATION
      state.currentView = "bubbleView"
      if (!state.currentBubble.threads) {
        state.currentBubble.threads = [];
      }

      // 2 Threads minimum
      if(state.currentBubble.threads.length < 2) {
        actions.loadMoreThreads()
      }
    }
    if (urlparts[2]) {
      // Update the temp thread object
      state.currentThread = state.currentBubble.threads.find(thread => thread._id == urlparts[2]); // TODO: DO THIS BETTER MORE OPTIMISATIONATION
      state.currentView = "threadView"
      if (!state.currentThread.messages) {
        state.currentThread.messages = [];
      }
    }





    return h("div", { class: "slider " + state.currentView }, [

      globalView(state, actions),
      bubbleView(state, actions),
      threadView(state, actions)

      // Route({ path: "/", render: () => globalView(state) }),
      // Route({ path: "/:bubble", render: () => bubbleView(state, actions) }),
      // Route({ path: "/:bubble/:thread", render: () => threadView(state, actions) })
    ])

  } else {
    return h("form", { class: "loginForm" }, [
      h("h2", {}, "Chose a name"),
      h("input", { type: "text" })
    ])
  }
}
