import { h } from "hyperapp"

import "./thread-footer.css"

const upvote = thread => {
  if (state.user) {
    if (thread.upvoted >= 5) {
      socket.emit('upvote', thread._id)
    }
  } else {
    actions.openLoginForm()
  }
}

const downvote = thread => {
  if (state.user) {
    if (thread.upvoted <= -5) {
      socket.emit('downvote', thread._id)
    }
  } else {
    actions.openLoginForm()
  }
}


export const ThreadFooter = ({ thread }) => (
  <div class="thread-footer" key="thread-footer">
    <div class="infos">
      <span>{thread.score} points</span>
      <span>{thread.userCount} users</span>
      <span>{thread.messageCount} messages</span>
    </div>
    <div class="actions">
      <button onclick={ev => upvote(thread)}>UP</button>
      <button onlcikc={ev => downvote(thread)}>DOWN</button>
    </div>
  </div>
)
