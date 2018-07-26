
import {h} from 'hyperapp'

import './thread-form.css'


const updateThreadForm = fragment => (state, actions) => actions.update({
  threadForm: fragment
});

const handleThreadForm = (ev, bubble) => (state, actions) => {
  ev.preventDefault();
  if (state.user) {
    socket.emit('new thread', {
      title: title,
      score: 0,
      type: 'default',
      trashed: false,
      userId: state.user._id,
      bubbleId: bubble._id
    });
  } else {
    actions.openLoginForm()
  }
}

export const ThreadForm = ({bubble}) => (state, actions, {title, type, opened} = state.threadForm || {}) => (
  <form class="thread-form" key="thread-form" method="post" onsubmit={ev => handleThreadForm(ev, bubble)(state, actions)}>
    <input type="text" name="title" id="title" placeholder="Type something..." oninput={ev => updateThreadForm({title: ev.target.value})(state, actions)} required />
    <button type="submit">Send</button>
  </form>
)