
import {h} from 'hyperapp'

import './message-form.css'

const handleMessageForm = (ev, thread) => {
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

export const MessageForm = ({thread}) => (
  <form class="message-form" action="/" method="post" onsubmit={ev => handleMessageForm(ev, thread)}>
    <input type="text" name="message" id="message" placeholder="Type something..." />
    <button type="submit">Send</button>
  </form>
)