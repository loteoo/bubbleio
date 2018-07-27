import { h } from "hyperapp"

import "./thread-footer.css"

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


export const ThreadFooter = ({ thread }) => (state, actions) => (
  <div class="thread-footer" key="thread-footer">
    <div class="infos">
      <span>{thread.score} points</span>
      <span>{thread.userCount || 0} users</span>
      <span>{thread.messageCount || 0} messages</span>
    </div>
    <div class="actions">
      <button onclick={ev => upvote(thread)(state, actions)}>UP</button>
      <button onclick={ev => downvote(thread)(state, actions)}>DOWN</button>
    </div>
  </div>
)
