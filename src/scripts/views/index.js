import {h} from 'hyperapp'
import {Link, Route} from "@hyperapp/router"
import {timeSince, isElementInViewport, shortenText} from '../utils/'




// Application root
export const view = (state, actions) => {

  // console.log(state);

  // If logged in
  if (state.user.username) {

    state.currentView = "globalView";

    let urlparts = window.location.pathname.split("/");


    // If there is a bubble in the URL
    if (urlparts[1]) {
      state.currentView = "bubbleView";

      // Check if bubble exists in cache
      state.currentBubble = state.bubbles.find(bubble => bubble.name == urlparts[1]); // TODO: DO THIS BETTER MORE OPTIMISATIONATION

      // If there was nothing in cache
      if (!state.currentBubble) {

        // Create a temporary bubble object
        state.currentBubble = {
          name: urlparts[1]
        }
      }

      // If no threads are in this bubble
      if (!state.currentBubble.threads) {
        state.currentBubble.threads = [];
      }
    }

    // If there is a thread in the URL
    if (urlparts[2]) {
      state.currentView = "threadView";

      // Check if thread exists in cache
      state.currentThread = state.currentBubble.threads.find(thread => thread._id == urlparts[2]); // TODO: DO THIS BETTER MORE OPTIMISATIONATION

      // If there was nothing in cache
      if (!state.currentThread) {

        // Create a temporary thread object
        state.currentThread = {
          _id: urlparts[2]
        }
      }


      // If no messages are in this thread
      if (!state.currentThread.messages) {
        state.currentThread.messages = [];
      }
    }




    return h("div", { class: "slider " + state.currentView }, [
      globalView(state, actions),
      bubbleView(state.currentBubble, state, actions),
      threadView(state.currentThread, state.currentBubble, state, actions)
    ])

  } else {
    return h("form", { class: "loginForm", onsubmit: ev => {
        ev.preventDefault();
        socket.emit('login', ev.target.username.value);
        return false;
      } }, [
      h("h2", {}, "Pick a name"),
      h("input", { type: "text", placeholder: "Type here...", autofocus: "autofocus", name: "username", id: "username" })
    ])
  }
}







const globalView = (state, actions) => (
  h("div", { class: "global-view" }, [
    h("div", { class: "frame" }, [
      h("h2", {}, state.user.username),
      h("ul", { class: "bubbles" }, [
        state.bubbles.map(bubbleItem),
        h("li", {}, [
          h("span", {}, "Create bubble")
        ])
      ])
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

    if (!currentBubble.title) {
      currentBubble.title = "Loading...";
    }

    let userCountTxt = "";
    if (currentBubble.userCount) {
      userCountTxt = " (" + currentBubble.userCount + ")";
    }

    return h("div", { class: "bubble-view", name: currentBubble.name, onupdate: (el, oldProps) => {
      if (oldProps.name != currentBubble.name) {
        // User switched bubbles
        socket.emit('switch bubble', {
          prevBubbleName: oldProps.name,
          nextBubbleName: currentBubble.name
        });
        console.log("--> join bubble: " + currentBubble.name);
      }
    }, oncreate: el => {
      socket.emit('switch bubble', {
        nextBubbleName: currentBubble.name
      });
      console.log("--> join bubble: " + currentBubble.name);
    } }, [
      h("div", { class: "frame", onscroll: (ev) => { if (isElementInViewport(ev.target.lastChild)) {  console.log("Load more not working yet"); } } }, [
        h("div", { class: "bubble-header" }, [
          Link({ to: "/" + name, class: "back" }),
          h("h2", {}, currentBubble.title + userCountTxt),
          h("div", { class: "options" }, [
            h("button", { onclick: ev => {
              if (ev.target.nextSibling.classList.contains("opened")) {
                ev.target.nextSibling.classList.remove("opened")
              } else {
                ev.target.nextSibling.classList.add("opened")
              }
            } }),
            h("ul", {}, [
              h("li", {}, h("span", {}, "Leave bubble"))
            ])
          ])
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

  if (display == "summary") {
    if (window.innerWidth >= 768) {
      display = "desktop";
    }
  }

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
    contentBlock = h("div", { class: "img" }, [
      h("img", { src: thread.src, alt: thread.title })
    ])
  } else if (thread.type == "youtube") {
    contentBlock = h("div", { class: "thumbnail", style: "background-image: url('"+thread.youtubeId+"')" })
  }

  if (!thread.src) {
    thread.src = "/img/thread_types/" + thread.type + ".svg";
  }

  if (display == "summary") {
    return h("li", { class: "thread", "data-type": thread.type, "data-upvoted": thread.upvoted, "data-display": display, onclick: () => {
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
    return h("li", { class: "thread ", "data-type": thread.type, "data-upvoted": thread.upvoted, "data-display": display }, [
      h("div", { class: "header" }, [
        h("div", { class: "thread-view-header" }, [
          h("div", { class: "back", onclick: () => {
            actions.location.go("/" + currentBubble.name);
          }}),
          h("h2", {}, thread.title)
        ]),
        h("p", {}, "by " + thread.author + " on " + currentBubble.name + " " + timeSince(thread.created))
      ]),
      contentBlock,
      threadFooter(thread, actions)
    ])
  } else if (display == "desktop") {
    return h("li", { class: "thread ", "data-type": thread.type, "data-upvoted": thread.upvoted, "data-display": display, onclick: () => {
      actions.location.go("/" + currentBubble.name + "/" + thread._id);
    } }, [
      h("div", { class: "thumbnail", Style: "background-image: url('"+thread.src+"')" }),
      h("div", { class: "content" }, [
        h("h2", {}, thread.title),
        h("div", { class: "info" }, [
          h("p", {}, "by " + thread.author + " on " + currentBubble.name + " " + timeSince(thread.created)),
          threadFooter(thread, actions)
        ])
      ])
    ])
  }
}



const threadFooter = (thread, actions) => (
  h("div", { class: "footer" }, [
    h("div", { class: "users", userCount: thread.userCount, _id: thread._id, onupdate: (element, oldProps) => {
      if (oldProps._id == thread._id) {
        if (oldProps.userCount < thread.userCount) {
          element.classList.add("countUp");
          setTimeout(() => {
            element.classList.remove("countUp");
          }, 25);
        }
      } } }, [
        h("div", { class: "count" }, [
          h("span", {}, thread.userCount)
        ])
      ]),
    h("div", { class: "replies", messageCount: thread.messages.length, _id: thread._id, onupdate: (element, oldProps) => {
      if (oldProps._id == thread._id) {
        if (oldProps.messageCount < thread.messages.length) {
          element.classList.add("countUp");
          setTimeout(() => {
            element.classList.remove("countUp");
          }, 25);
        }
      } } }, [
        h("div", { class: "count" }, [
          h("span", {}, thread.messages.length)
        ])
      ]),
    h("button", { class: "upvote", score: thread.score, onclick: (ev) => {
      ev.stopPropagation();
      actions.upvote(thread);
    }, _id: thread._id, onupdate: (element, oldProps) => {
      if (oldProps._id == thread._id) {
        if (oldProps.score < thread.score) {
          element.classList.add("countUp");
          setTimeout(() => {
            element.classList.remove("countUp");
          }, 25);
        }
      }
    } }, thread.score)
  ])
)







const threadView = (currentThread, currentBubble, state, actions) => {
  if (currentThread) {
    return h("div", { class: "thread-view", _id: currentThread._id, bubble_id: currentThread.bubble_id, messageCount: currentThread.messages.length, onupdate: (el, oldProps) => {
      if (oldProps._id != currentThread._id) {
        // User switched thread
        socket.emit('switch thread', {
          prevThread: oldProps,
          nextThread: currentThread
        });
        console.log("--> join thread: " + currentThread._id);
      }

      // If there is a new message
      if (oldProps.messageCount < currentThread.messages.length) {
        // Scroll down
        el.children[0].scrollTop = el.children[0].scrollHeight;
      }

    }, oncreate: el => {
      socket.emit('switch thread', {
        nextThread: currentThread
      });
      console.log("--> join thread: " + currentThread._id);
    } }, [
      h("div", { class: "frame", onscroll: (ev) => { if (isElementInViewport(ev.target.firstChild)) { console.log("Load more not working yet"); } } }, [
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
  if (message.sender == state.user.username) {
    provenance = "sent"
  } else {
    provenance = "received"
  }
  return h("li", { class: provenance, oncreate: el => {
    el.classList.add("newmessage");
    setTimeout(() => {
      el.classList.remove("newmessage");
    }, 25);
  } }, [
    h("div", { class: "content" }, message.message),
    h("div", { class: "info" }, message.sender + " " + timeSince(message.created))
  ])
}











const keyboardComponent = (state, actions) => (
  h("form", { class: "keyboard " + state.keyboardMode, onsubmit: ev => { actions.keyboardSubmit(ev); return false; } }, [
    h("div", { class: "expander " + state.keyboardStatus, onclick: () => actions.expandKeyboard(state.keyboardStatus) }, [
      h("div", { class: "default", onclick: ev => { actions.changeKeyboardMode("default") } }, "x"),
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
