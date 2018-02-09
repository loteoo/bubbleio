import {h} from 'hyperapp'
import {Link, Route} from "@hyperapp/router"
import {timeSince, isElementInViewport, shortenText} from '../utils/'




// Application root
export const view = (state, actions) => {

  // If logged in
  if (state.username) {

    state.currentView = "globalView";

    let urlparts = window.location.pathname.split("/");

    if (urlparts[1]) {
      // Update the temp bubble object
      state.currentBubble = state.bubbles.find(bubble => bubble.name == urlparts[1]); // TODO: DO THIS BETTER MORE OPTIMISATIONATION
      state.currentView = "bubbleView";

      if (!state.currentBubble.threads) {
        state.currentBubble.threads = [];
        actions.loadMoreThreads();
      }

    }
    if (urlparts[2]) {
      // Update the temp thread object
      state.currentThread = state.currentBubble.threads.find(thread => thread._id == urlparts[2]); // TODO: DO THIS BETTER MORE OPTIMISATIONATION
      state.currentView = "threadView";
    }




    return h("div", { class: "slider " + state.currentView }, [
      globalView(state, actions),
      bubbleView(state.currentBubble, state, actions),
      threadView(state.currentThread, state.currentBubble, state, actions)
    ])

  } else {
    return h("form", { class: "loginForm", onsubmit: ev => { actions.login(ev); return false; } }, [
      h("h2", {}, "Pick a name"),
      h("input", { type: "text", placeholder: "Type here...", autofocus: "autofocus", name: "username", id: "username" })
    ])
  }
}







const globalView = (state, actions) => (
  h("div", { class: "global-view" }, [
    h("div", { class: "frame" }, [
      h("h2", {}, state.username),
      h("ul", { class: "bubbles" }, state.bubbles.map(bubbleItem))
    ])
  ])
)


const bubbleItem = (bubble) => {
  let userCountTxt = "";
  if (bubble.userCount) {
    userCountTxt = " (" + bubble.userCount + ")";
  }
  return h("li", {}, [
    Link({ to: "/" + bubble.name }, bubble.title + userCountTxt)
  ])
}









const bubbleView = (currentBubble, state, actions) => {
  if (currentBubble) {


    let userCountTxt = "";
    if (currentBubble.userCount) {
      userCountTxt = " (" + currentBubble.userCount + ")";
    }

    return h("div", { class: "bubble-view", _id: currentBubble._id, onupdate: (el, oldProps) => {
      if (!oldProps._id) {
        oldProps._id = "NO BUBBLE";
      }
      if (oldProps._id != currentBubble._id) {
        // User switched bubbles

        console.log("join room: " + currentBubble._id);
        socket.emit('switch room', {
          prevRoomId: oldProps._id,
          nextRoomId: currentBubble._id
        });

        actions.loadMoreThreads();


      }
    } }, [
      h("div", { class: "frame", onscroll: (ev) => { if (isElementInViewport(ev.target.lastChild)) { actions.loadMoreThreads() } } }, [
        h("div", { class: "bubble-header" }, [
          Link({ to: "/" + name, class: "back" }),
          h("h2", {}, currentBubble.title + userCountTxt)
        ]),
        h("ul", { class: "threads" }, currentBubble.threads.map(thread => threadItem(thread, currentBubble, actions))),
        keyboardComponent(state, actions),
        h("div", { class: "loadMore" })
      ])
    ])
  }
}



const threadItem = (thread, currentBubble, actions, display = "summary") => {
  if (!thread.userCount) {
    thread.userCount = 0;
  }
  if (!thread.messages) {
    thread.messages = [];
  }
  if (!thread.order) {
    thread.order = 0;
  }
  if (!thread.upvoted) {
    thread.upvoted = "";
  }
  // console.log(thread.order);

  let contentBlock;
  if (thread.type == "default") {
    contentBlock = null
  } else if (thread.type == "text") {

    if (display == "summary") {
      contentBlock = h("div", { class: "text" }, shortenText(thread.text, 250) + "...");
    } else {
      contentBlock = h("div", { class: "text" }, thread.text);
    }
  } else if (thread.type == "link") {
    contentBlock = h("a", { class: "link", href: thread.url, target: "_blank" }, thread.url)
  } else if (thread.type == "image") {
    contentBlock = h("img", { class: "img", src: thread.src, alt: thread.title })
  } else if (thread.type == "youtube") {
    contentBlock = h("div", { class: "thumbnail", style: "background-image: url('"+thread.youtubeId+"')" })
  }


  if (display == "summary") {
    return h("li", { class: "thread", "data-type": thread.type, "data-upvoted": thread.upvoted, "data-display": display, onclick: () => {
      console.log("join thread: " + thread._id);
      socket.emit('join thread', thread);
      actions.location.go("/" + currentBubble.name + "/" + thread._id);
    } }, [
      h("div", { class: "header" }, [
        h("h4", {}, thread.title),
        h("p", {}, "by " + thread.author + " on " + currentBubble.name + " " + timeSince(thread.created))
      ]),
      contentBlock,
      threadFooter(thread, actions)
    ])
  } else if (display == "full") {
    return h("li", { class: "thread ", "data-type": thread.type, "data-upvoted": thread.upvoted }, [
      h("div", { class: "header" }, [
        h("div", { class: "thread-view-header" }, [
          h("div", { class: "back", onclick: () => {
            socket.emit('leave thread', thread);
            actions.location.go("/" + currentBubble.name);
          }}),
          h("h2", {}, thread.title)
        ]),
        h("p", {}, "by " + thread.author + " on " + currentBubble.name + " " + timeSince(thread.created))
      ]),
      contentBlock,
      threadFooter(thread, actions)
    ])
  }
}



const threadFooter = (thread, actions) => (
  h("div", { class: "footer" }, [
    h("div", { class: "users", userCount: thread.userCount, onupdate: (element, oldProps) => {
      if (oldProps.userCount < thread.userCount) {
        element.classList.add("countUp");
        setTimeout(() => {
          element.classList.remove("countUp");
        }, 50);
      } } }, [
        h("div", { class: "count" }, [
          h("span", {}, thread.userCount)
        ])
      ]),
    h("div", { class: "replies", messageCount: thread.messages.length, onupdate: (element, oldProps) => {
      if (oldProps.messageCount < thread.messages.length) {
        element.classList.add("countUp");
        setTimeout(() => {
          element.classList.remove("countUp");
        }, 50);
      } } }, [
        h("div", { class: "count" }, [
          h("span", {}, thread.messages.length)
        ])
      ]),
    h("button", { class: "upvote", score: thread.score, onclick: (ev) => {
      ev.stopPropagation();
      actions.upvote(thread);
    }, onupdate: (element, oldProps) => {
      if (oldProps.score < thread.score) {
        element.classList.add("countUp");
        setTimeout(() => {
          element.classList.remove("countUp");
        }, 50);
      }
    } }, thread.score)
  ])
)








const threadView = (currentThread, currentBubble, state, actions) => {
  if (currentThread) {
    return h("div", { class: "thread-view", _id: currentThread._id, onupdate: (el, oldProps) => {
      if (oldProps._id != currentThread._id) {

        // User switched thread
        actions.loadMoreMessages();

      }
    } }, [
      h("div", { class: "frame", onscroll: (ev) => { if (isElementInViewport(ev.target.firstChild)) { actions.loadMoreMessages() } } }, [
        h("div", { class: "loadMoreMessages" }),
        threadItem(currentThread, currentBubble, actions, "full"),
        h("ul", { class: "messages" }, currentThread.messages.map(message => messageItem(message, state))),
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
  h("form", { class: "keyboard " + state.keyboardMode, onsubmit: ev => { actions.keyboardSubmit(ev); return false; } }, [
    h("div", { class: "expander " + state.keyboardStatus, onclick: () => actions.expandKeyboard(state.keyboardStatus) }, [
      h("div", { class: "text", onclick: ev => { actions.changeKeyboardMode("text") } }, "txt"),
      h("div", { class: "link", onclick: ev => { actions.changeKeyboardMode("link") } }, "url"),
      h("div", { class: "image", onclick: ev => { actions.changeKeyboardMode("image") } }, "pic")
    ]),
    h("input", { class: "title", type: "text", name: "title", placeholder: "Type something..." }),
    h("textarea", { placeholder: "Text...", name: "text" }),
    h("input", { class: "link", type: "text", name: "link", placeholder: "Paste link here" }),
    h("div", { class: "image" }, [
      h("input", { type: "file", name: "image_file", id: "image_file" }),
      h("label", { for: "image_file" }),
      h("input", { type: "text", name: "image_link", placeholder: "Or paste link here" })
    ]),
    h("button", { class: "submit", type: "submit" })
  ])
)
