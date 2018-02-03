import {h} from 'hyperapp'
import {Link, Route} from "@hyperapp/router"
import {timeSince, isElementInViewport} from '../utils/'




// Application root
export const view = (state, actions) => {

  // console.log("Rendered");

  // If logged in
  if (state.username) {


    let urlparts = window.location.pathname.split("/");

    state.currentView = "globalView"

    if (urlparts[1]) {
      // Update the temp bubble object
      state.currentBubble = state.bubbles.find(bubble => bubble.name == urlparts[1]); // TODO: DO THIS BETTER MORE OPTIMISATIONATION
      state.currentView = "bubbleView"

      if (!state.currentBubble.threads) {
        state.currentBubble.threads = [];
        actions.loadMoreThreads();
      }

    }
    if (urlparts[2]) {
      // Update the temp thread object
      state.currentThread = state.currentBubble.threads.find(thread => thread._id == urlparts[2]); // TODO: DO THIS BETTER MORE OPTIMISATIONATION
      state.currentView = "threadView"
    }




    return h("div", { class: "slider " + state.currentView }, [
      globalView(state, actions),
      bubbleView(state, actions),
      threadView(state, actions)
    ])

  } else {
    return h("form", { class: "loginForm", onsubmit: ev => { actions.login(ev); return false; } }, [
      h("h2", {}, "Pick a name"),
      h("input", { type: "text", placeholder: "Type here..." })
    ])
  }
}







const globalView = (state, actions) => (
  h("div", { class: "global-view" }, [
    h("div", { class: "frame" }, [
      h("h2", {}, state.username),
      h("ul", { class: "bubbles" }, state.bubbles.map(bubble => bubbleItem(bubble, state, actions)))
    ])
  ])
)


const bubbleItem = (bubble, state, actions) => {
  let userCount = "";
  if (bubble.userCount) {
    userCount = " (" + bubble.userCount + ")";
  }
  return h("li", {}, [
    Link({ to: "/" + bubble.name }, bubble.title + userCount)
  ])
}









const bubbleView = (state, actions) => {

  // Score = (P-1) / (T+2)^G
  //
  // where,
  // P = points of an item (and -1 is to negate submitters vote)
  // T = time since submission (in hours)
  // G = Gravity, defaults to 1.8 in news.arc
  if (state.currentBubble) {
    return h("div", { class: "bubble-view", _id: state.currentBubble._id, onupdate: (el, oldProps) => {
      if (oldProps._id != state.currentBubble._id) {
        // User switched bubbles

        if (!oldProps._id) {
          oldProps._id = null;
        }
        socket.emit('switch room', {
          prevRoom: oldProps._id,
          nextRoom: state.currentBubble._id
        });

        actions.loadMoreThreads();

        console.log(state);

      }
    } }, [
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
  if (!thread.userCount) {
    thread.userCount = 0;
  }
  if (!thread.messages) {
    thread.messages = [];
  }

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
  return h("li", { class: thread.type, onclick: () => {
    socket.emit('join thread', thread);
    actions.location.go("/" + state.currentBubble.name + "/" + thread._id);
  } }, [
    h("div", { class: "thread-header" }, [
      h("h4", {}, thread.title),
      h("p", {}, "by " + thread.author + " on " + state.currentBubble.name + " " + timeSince(thread.created))
    ]),
    contentBlock,
    h("div", { class: "thread-footer" }, [
      h("div", { class: "info" }, thread.userCount + " in this thread"),
      h("button", { class: "upvote", onclick: (ev) => { ev.stopPropagation(); actions.upvote(thread); } }, thread.score)
    ])
  ])
}











const threadView = (state, actions) => {
  if (state.currentThread) {
    return h("div", { class: "thread-view" }, [
      h("div", { class: "frame" }, [
        h("div", { class: "thread-header" }, [
          h("div", { class: "back", onclick: () => {
            socket.emit('leave thread', state.currentThread);
            actions.location.go("/" + state.currentBubble.name);
          } }),
          h("h2", {}, state.currentThread.title)
        ]),
        h("ul", { class: "messages" }, state.currentThread.messages.map(message => messageItem(message, state))),
        keyboardComponent(state, actions)
      ])
    ])
  }
}


const messageItem = (message, state) => {
  let provenance;
  if (message.sender == state.username) {
    provenance = "sent"
  } else {
    provenance = "received"
  }
  return h("li", { class: provenance }, [
    h("div", { class: "content" }, message.message),
    h("div", { class: "info" }, message.sender + " " + timeSince(message.created))
  ])
}











const keyboardComponent = (state, actions) => (
  h("form", { class: "keyboard", onsubmit: ev => { actions.keyboardSubmit(ev); return false; } }, [
    h("div", { class: "expander " + state.keyboardStatus, onclick: () => actions.expandKeyboard(state.keyboardStatus) }, [
      h("div", { class: "text", onclick: ev => { ev.stopPropagation() } }, "txt"),
      h("div", { class: "link", onclick: ev => { ev.stopPropagation() } }, "url"),
      h("div", { class: "picture", onclick: ev => { ev.stopPropagation() } }, "pic")
    ]),
    h("input", { type: "text", placeholder: "Type something...", value: state.keyboardVal }),
    h("button", { class: "submit", type: "submit" })
  ])
)
