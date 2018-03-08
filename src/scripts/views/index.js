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
      state.currentBubbleName = urlparts[1];
      state.currentView = "bubbleView";
      if (urlparts[2]) {
        state.currentThreadId = urlparts[2];
        state.currentView = "threadView";
      }
    }


    // Load bubble from state
    let currentBubble = state.bubbles.find(bubble => bubble.name == state.currentBubbleName); // TODO: Only have current bubble / thread IDs in the state, then currentBubble and currentThread are 'let' vars not state fragments
    let currentThread;

    // If bubble exists in state and has threads
    if (currentBubble && currentBubble.threads) {

      // Load thread from state
      currentThread = currentBubble.threads.find(thread => thread._id == state.currentThreadId); // TODO: DO THIS BETTER MORE OPTIMISATIONATION

    }




    return (
      <div class={"slider " + state.currentView}>
        <UserView currentBubble={currentBubble} state={state} />
        <CurrentBubble currentBubble={currentBubble} currentThread={currentThread} state={state} actions={actions} />
        <CurrentThread currentBubble={currentBubble} currentThread={currentThread} state={state} actions={actions} />
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
