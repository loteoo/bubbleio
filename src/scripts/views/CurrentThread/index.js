import {h} from 'hyperapp'
import {Keyboard} from '../Keyboard/'

import {Thread} from '../CurrentBubble/Thread/'

import {timeSince, isElementInViewport, shortenText} from '../../utils/'



export const CurrentThread = ({currentThread, currentBubble, state, actions}) => {
  if (currentThread) {
    return h("div", { class: "thread-view", _id: currentThread._id, bubble_id: currentThread.bubble_id, messageCount: currentThread.messages.length, onupdate: (el, oldProps) => {
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

    }, oncreate: el => {
      socket.emit('switch thread', {
        nextThread: currentThread
      });
      console.log("--> join thread: " + currentThread._id);
    } }, [
      h("div", { class: "frame", onscroll: (ev) => { if (isElementInViewport(ev.target.firstChild)) { console.log("Load more not working yet"); } } }, [
        h("div", { class: "loadMoreMessages" }),
        Thread(currentThread, currentBubble, actions, "full"),
        h("ul", { class: "messages" }, currentThread.messages.map(message => messageItem(message, state))),
        Keyboard(state, actions)
      ])
    ])
  }
}


const messageItem = (message, state) => {
  let provenance;
  if (message.sender == state.user.username) {
    provenance = "sent"
  } else {
    provenance = "received"
  }
  return h("li", { key: message._id, class: provenance, oncreate: el => {
    el.classList.add("newmessage");
    setTimeout(() => {
      el.classList.remove("newmessage");
    }, 25);
  } }, [
    h("div", { class: "content" }, message.message),
    h("div", { class: "info" }, message.sender + " " + timeSince(message.created))
  ])
}
