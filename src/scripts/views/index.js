import {h} from 'hyperapp'

import {UserView} from './UserView/'
import {CurrentBubble} from './CurrentBubble/'
import {CurrentThread} from './CurrentThread/'




// Application root
export const view = (state, actions) => {

  // console.log(state);

  // If logged in
  if (state.user.username) {


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
      <div class={"slider " + state.currentView}>
        <UserView currentBubble={state.currentBubble} state={state} />
        <CurrentBubble currentBubble={state.currentBubble} currentThread={state.currentThread} state={state} actions={actions} />
        <CurrentThread currentBubble={state.currentBubble} currentThread={state.currentThread} state={state} actions={actions} />
      </div>
    )
  } else {
    return (
      <form class="loginForm" onsubmit={ev => {
          ev.preventDefault();
          socket.emit('login', ev.target.username.value);
          return false;
        }}>
        <h2>Pick a name</h2>
        <input type="text" placeholder="Type here..." name="username" autofocus />
      </form>
    )
  }
}
