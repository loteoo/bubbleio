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
        <div class="frame" onscroll={ev => { if (isElementInViewport(ev.target.children[1].firstChild)) { console.log("Load more not working yet"); } }}>

          <Thread currentThread={currentThread} currentBubble={currentBubble} />

          <div class="scrollSpacer">
            <div class="conversation">
              <li class="loadMoreMessages"></li>
              <ul class="messages" messageCount={currentThread.messages.length} onupdate={(el, oldProps) => {
                  // If there is a new message
                  if (oldProps.messageCount < currentThread.messages.length) {
                    // Scroll down message list
                    el.scrollTop = el.scrollHeight;
                  }
                }}>
                {currentThread.messages.map(message => MessageItem({message, state}))}
              </ul>
            </div>
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


const MessageItem = ({message, state}) => {
  return (
    <li key={message._id} sent={(message.sender == state.user.username).toString()} oncreate={el => {
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
