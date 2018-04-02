import {h} from 'hyperapp'

import {UserView} from './UserView/'
import {CurrentBubble} from './CurrentBubble/'
import {CurrentThread} from './CurrentThread/'


// TODO: Remove auto-fills on inputs

// TODO: "username" is typing...

// TODO: Linkify links (when someone shares a link in messages, create a <a href>)

// TODO: View full images & text on preview mode desktop

// TODO: Deleting bugfix (use archived attr maybe)
// Buggs when user loads thread, closes site, thread gets deleted, thread still apprear because cache hasent updated
// Same thing with bubbles

// TODO: Add button to login screen (confusing for some people)

// TODO: Links that link to other bubbles should not open in new tabs

// TODO: Upvote/downvote btn should not be click through when cooling down

// TODO: Dynamic themes (gradients)

// Application root
export const view = (state, actions) => {

  // console.log(state);

  // If logged in
  if (state.user._id) {


    let urlparts = window.location.pathname.split("/");


    // Manage mobile nav and last bubble / thread from url
    state.currentView = "userView";


    if (urlparts[1]) {

      // Load bubble from state
      state.currentBubble = state.bubbles.find(bubble => bubble.name == urlparts[1]);


      // Switch mobile view
      state.currentView = "bubbleView";

      // If the bubble doesn't exist in the state yet
      if (!state.currentBubble) {
        // Create a temporary bubble while it loads
        state.currentBubble = {
          name: urlparts[1],
          threads: []
        }
      }



      if (urlparts[2]) {

        // Load thread from state
        state.currentThread = state.currentBubble.threads.find(thread => thread._id == urlparts[2]);

        // Switch mobile view
        state.currentView = "threadView";
      }
    }





    return (
      <div class={"slider " + state.currentView + " " + state.user.layoutMode}>
        <UserView currentBubble={state.currentBubble} />
        <CurrentBubble currentBubble={state.currentBubble} currentThread={state.currentThread} />
        <CurrentThread currentBubble={state.currentBubble} currentThread={state.currentThread} />
      </div>
    )
  } else {
    return (
      <form class="loginForm" onsubmit={ev => {
          ev.preventDefault();
          socket.emit('login', {
            username: ev.target.username.value
          });
          return false;
        }}>
        <h2>Pick a name</h2>
        <input type="text" placeholder="Type here..." name="username" minlength="3" maxlength="50" required autofocus />
      </form>
    )
  }
}
