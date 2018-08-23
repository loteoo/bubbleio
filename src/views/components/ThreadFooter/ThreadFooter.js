import { h } from "hyperapp"

import "./thread-footer.css"

import {Up} from '../../icons/Up.js'
import {Down} from '../../icons/Down.js'

const upvote = thread => (state, actions) => {
  if (state.user) {
    if ((thread.voted || 0) <= 5) {
      socket.emit('vote', {
        threadId: thread._id,
        quantity: 1
      })
    }
  } else {
    actions.openLoginForm()
  }
}

const downvote = thread => (state, actions) => {
  if (state.user) {
    if ((thread.voted || 0) >= -5) {
      socket.emit('vote', {
        threadId: thread._id,
        quantity: -1
      })
    }
  } else {
    actions.openLoginForm()
  }
}


export const ThreadFooter = ({thread}) => (state, actions) => (
  <div class="thread-footer" key="thread-footer">
    <div class="info">
      <span>{thread.score} points</span>
      <span>{thread.userCount || 0} users</span>
      <span>{thread.messageCount || 0} messages</span>
    </div>
    <div class="actions">
      <button class="upvote" onclick={ev => upvote(thread)(state, actions)}><Up /></button>
      <button class="downvote" onclick={ev => downvote(thread)(state, actions)}><Down /></button>
    </div>
  </div>
)
