
import {h} from 'hyperapp'

import './message-form.css'

const updateMessageForm = fragment => (state, actions) => actions.update({
  messageForm: fragment
});

const handleMessageForm = (ev, thread) => (state, actions) => {
  ev.preventDefault();
  if (state.user) {
    socket.emit('new message', {
      userId: state.user._id,
      threadId: thread._id,
      message: ev.target.message.value
    });
  } else {
    actions.openLoginForm()
  }
}

export const MessageForm = ({thread}) => (state, actions, {message} = state.messageForm || {}) => (
  <form class="message-form" action="/" method="post" onsubmit={ev => handleMessageForm(ev, thread)(state, actions)}>
    <input type="text" name="message" id="message" placeholder="Type something..." oninput={ev => updateMessageForm({message: ev.target.value})(state, actions)} />
    <button type="submit">Send</button>
  </form>
)