
import {h} from 'hyperapp'

import './thread-form.css'


const set = fragment => main.update({
  threadForm: fragment
});

const handleThreadForm = (ev, bubble) => (state, actions, {title, type = type || 'default'} = state.threadForm) => {
  ev.preventDefault();
  if (state.user) {
    socket.emit('new thread', {
      title,
      score: 0,
      type,
      trashed: false,
      userId: state.user._id,
      bubbleId: bubble._id
    });
    actions.update({threadForm: {}})
  } else {
    actions.openLoginForm()
  }
}

export const ThreadForm = ({bubble}) => (state, actions, {title, type, opened} = state.threadForm || {}) => (
  <form class="thread-form" key="thread-form" method="post" onsubmit={ev => handleThreadForm(ev, bubble)(state, actions)}>
    <input type="text" name="title" id="title" placeholder="Type something..." value={title} oninput={ev => set({title: ev.target.value})} required />
    <button type="submit">Send</button>
  </form>
)