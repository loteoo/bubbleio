import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"
import {timeSince, isElementInViewport, shortenText} from '../utils/'

import {UserView} from './UserView/'
import {CurrentBubble} from './CurrentBubble/'
import {CurrentThread} from './CurrentThread/'
import {Keyboard} from './Keyboard/'
import {Thread} from './CurrentBubble/Thread/'




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
      UserView(state, actions),
      CurrentBubble(state.currentBubble, state, actions),
      CurrentThread(state.currentThread, state.currentBubble, state, actions)
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
