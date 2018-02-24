import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"
import {ThreadKeyboard} from './ThreadKeyboard/'

import {timeSince, isElementInViewport, shortenText} from '../../utils/'

import {ThreadItem} from './ThreadItem/'


export const CurrentBubble = ({currentBubble, state, actions}) => {
  if (currentBubble) {

    if (!currentBubble.title) {
      currentBubble.title = "Loading...";
    }

    let userCountTxt = "";
    if (currentBubble.userCount) {
      userCountTxt = " (" + currentBubble.userCount + ")";
    }

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
        <div class="frame" onscroll={ev => { if (isElementInViewport(ev.target.lastChild)) {  console.log("Load more not working yet"); } }}>
          <div class="bubble-header">
            <Link class="back" to={"/" + name}></Link>
            <h2>{currentBubble.title + userCountTxt}</h2>
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
                <li><span>Leave bubble</span></li>
              </ul>
            </div>
          </div>
          <ul class="threads">
            {currentBubble.threads.map((thread, index) => ThreadItem(thread, index, currentBubble, actions))}
          </ul>
          {ThreadKeyboard(state, actions)}
          <div class="loadMore"></div>
        </div>
      </div>
    )
  }
}
