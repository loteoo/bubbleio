
import {h} from 'hyperapp'

import './message-form.css'

const set = fragment => main.update({messageForm: fragment});

const handleSubmit = (ev, thread) => (state, actions) => {
  ev.preventDefault();
  if (state.user) {
    socket.emit('new message', {
      userId: state.user._id,
      threadId: thread._id,
      text: ev.target.text.value
    })
    actions.set({messageForm: {}})
  } else {
    actions.openLoginForm()
  }
}

export const MessageForm = ({thread}) => (state, actions, {text} = state.messageForm || {}) => (
  <form class="message-form" action="/" method="post" onsubmit={ev => handleSubmit(ev, thread)(state, actions)}>
    <input type="text" name="text" id="text" placeholder="Type something..." value={text} oninput={ev => set({text: ev.target.value})} />
    <button type="submit">Send</button>
  </form>
)