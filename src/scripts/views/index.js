import {h} from 'hyperapp'

import {UserView} from './UserView/'
import {CurrentBubble} from './CurrentBubble/'
import {CurrentThread} from './CurrentThread/'




// Application root
export const view = (state, actions) => {

  // console.log(state);

  // If logged in
  if (state.user.username) {

    state.currentView = "userView";

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


    }




    return (
      <div class={ "slider " + state.currentView}>
        <UserView state={state} actions={actions} />
        <CurrentBubble currentBubble={state.currentBubble} state={state} actions={actions} />
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
