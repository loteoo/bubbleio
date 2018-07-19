import {h} from 'hyperapp'
import {timeSince, isElementInViewport, shortenText} from '../../utils/'

import {Thread} from './Thread/'
import {MessageKeyboard} from './MessageKeyboard/'




export const CurrentThread = ({currentThread, currentBubble}) => (state, actions) => {
  if (currentThread) {
    return (
      <div class="thread-view" _id={currentThread._id} bubble_id={currentThread.bubble_id} onupdate={(el, oldProps) => {
        if (oldProps._id != currentThread._id) {
          // User switched thread
          socket.emit('switch thread', {
            prevThread: oldProps,
            nextThread: currentThread
          });
          console.log("--> join thread: " + currentThread._id);
        }
      }} oncreate={el => {
        socket.emit('switch thread', {
          nextThread: currentThread
        });
        console.log("--> join thread: " + currentThread._id);
      }}>
        <div class="frame">

          <Thread currentThread={currentThread} currentBubble={currentBubble} />

          <div class="scroller" onscroll={ev => {
            if (isElementInViewport(ev.target.children[0].lastChild)) {
              console.log("Load more not working yet");
            }
          }} messageCount={currentThread.messages.length} onupdate={(el, oldProps) => {
            // If there is a new message
            if (oldProps.messageCount < currentThread.messages.length) {
              // Scroll down message list
              el.scrollTop = el.scrollHeight;
            }
          }}>
            <ul class="messages">
              {currentThread.messages.map((message, index) => MessageItem({message, index}))}
              <li class="loadMoreMessages"></li>
            </ul>
          </div>

          <MessageKeyboard currentThread={currentThread} />
        </div>
      </div>
    )
  } else if (currentBubble) {
    return (
      <div class="thread-view no-thread">
        <h2>Now pick a thread!</h2>
      </div>
    )
  }
}


const MessageItem = ({message, index}) => (state, actions) => {
  return (
    <li key={message._id} sent={(message.sender == state.user.username).toString()} index={index} oncreate={el => {
      el.classList.add("newmessage");
      setTimeout(() => {
        el.classList.remove("newmessage");
      }, index * 20);
    }}>
      <div class="content">{message.message}</div>
      <div class="info">{message.sender + " " + timeSince(message.created)}</div>
    </li>
  )
}