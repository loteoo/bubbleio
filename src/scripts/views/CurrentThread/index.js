import {h} from 'hyperapp'
import {MessageKeyboard} from './MessageKeyboard/'

import {Thread} from './Thread/'

import {timeSince, isElementInViewport, shortenText} from '../../utils/'



export const CurrentThread = ({currentThread, currentBubble, state, actions}) => {
  if (currentThread) {
    return (
      <div class="thread-view" _id={currentThread._id} bubble_id={currentThread.bubble_id} messageCount={currentThread.messages.length} onupdate={(el, oldProps) => {
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

      }} oncreate={el => {
        socket.emit('switch thread', {
          nextThread: currentThread
        });
        console.log("--> join thread: " + currentThread._id);
      }}>
        <div class="frame" onscroll={(ev) => { if (isElementInViewport(ev.target.firstChild)) { console.log("Load more not working yet"); } }}>
          <div class="loadMoreMessages"></div>
          {Thread(currentThread, null, currentBubble, actions)}
          <ul class="messages">
            {currentThread.messages.map(message => MessageItem(message, state))}
          </ul>
          {MessageKeyboard(currentThread, state, actions)}
        </div>
      </div>
    )
  }
}


const MessageItem = (message, state) => {
  let provenance;
  if (message.sender == state.user.username) {
    provenance = "sent"
  } else {
    provenance = "received"
  }
  return (
    <li key={message._id} class={provenance} oncreate={el => {
      el.classList.add("newmessage");
      setTimeout(() => {
        el.classList.remove("newmessage");
      }, 25);
    }}>
      <div class="content">{message.message}</div>
      <div class="info">{message.sender + " " + timeSince(message.created)}</div>
    </li>
  )
}
