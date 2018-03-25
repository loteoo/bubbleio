import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"
import {isElementInViewport, shortenText} from '../../utils/'

import {ThreadItem} from './ThreadItem/'
import {ThreadKeyboard} from './ThreadKeyboard/'


export const CurrentBubble = ({currentBubble, currentThread}) => (state, actions) => {
  if (currentBubble) {
    return (
      <div class="bubble-view" name={currentBubble.name} onupdate={(el, oldProps) => {
        if (oldProps.name != currentBubble.name) {
          // User switched bubbles
          socket.emit('switch bubble', {
            prevBubbleName: oldProps.name,
            nextBubbleName: currentBubble.name
          });
          console.log("--> join bubble: " + currentBubble.name);
        }
      }} oncreate={el => {
        socket.emit('switch bubble', {
          nextBubbleName: currentBubble.name
        });
        console.log("--> join bubble: " + currentBubble.name);
      }}>
        <div class="frame" onscroll={ev => {
            if (isElementInViewport(ev.target.lastChild)) {
              console.log("load more...");
              socket.emit('get bubble', {
                bubble_id: currentBubble._id,
                skip: currentBubble.threads.length,
                limit: 10
              });
            }
          }}>
          <div class="bubble-header">
            <Link class="back" to={"/" + name}></Link>
            <h2>{currentBubble.title}</h2>
            <div class="options">
              <button onclick={ev => {
                if (ev.target.nextSibling.classList.contains("opened")) {
                  ev.target.nextSibling.classList.remove("opened")
                } else {
                  ev.target.nextSibling.classList.add("opened")
                }
              }}>
              </button>
              <ul>
                <li onclick={ev => {
                  ev.target.parentElement.parentElement.classList.remove("opened");
                  actions.location.go("/");
                  actions.deleteBubble(currentBubble);
                  socket.emit('leave bubble', currentBubble);
                }}><span>Leave bubble</span></li>
                <NotificationToggle currentBubble={currentBubble} />
                <OwnerAction currentBubble={currentBubble} />
              </ul>
            </div>
          </div>
          <ul class="threads">
            {currentBubble.threads.map((thread, index) => ThreadItem({thread, index, currentBubble, currentThread}))}
          </ul>
          <ThreadKeyboard currentBubble={currentBubble} />
          <div class="loadMore"></div>
        </div>
      </div>
    )
  } else {
    return (
      <div class="bubble-view no-bubble">
        <h2>Pick a bubble!</h2>
      </div>
    )
  }
}

// TODO: make this work VISUALLY for now
// TODO: Push notifications!
export const NotificationToggle = ({currentBubble}) => (state, actions) => {
  if (currentBubble.notifications === true) {
    return (
      <li onclick={ev => {
        console.log("Comming soon...");
      }}><span>Turn off notifications</span></li>
    )
  } else {
    return (
      <li onclick={ev => {
        console.log("Comming soon...");
      }}><span>Turn on notifications</span></li>
    )
  }
}


export const OwnerAction = ({currentBubble}) => (state, actions) => {
  if (currentBubble.author == state.user.username) {
    return (
      <li onclick={ev => {
        ev.target.parentElement.parentElement.classList.remove("opened");
        actions.location.go("/");
        actions.deleteBubble(currentBubble);
        socket.emit('archive bubble', currentBubble);
      }}><span>Delete bubble</span></li>
    )
  }
}
