import {h} from 'hyperapp'

import {TextInput} from '../../theme/TextInput'
import {Socket} from '../../../utils'

import './style.css'

// Init
const init = {
  message: ''
}


const ReceiveMessage = (state, message) => ({
  ...state,
  threads: {
    ...state.threads,
    [message.ThreadId]: {
      ...state.threads[message.ThreadId],
      Messages: [message].concat(state.threads[message.ThreadId].Messages)
    }
  }
})




// Actions
const HandleMessageForm = (state, ev) => {
  ev.preventDefault()
  return [
    {
      ...state,
      messageForm: {
        ...state.messageForm,
        text: ''
      }
    },
    Socket.emit({
      event: 'new message',
      data: {
        threadId: state.location.threadId,
        text: state.messageForm.text
      },
      action: ReceiveMessage
    })
  ]
}

// Actions
const SetMessageForm = (state, key, value) => ({
  ...state,
  messageForm: {
    ...state.messageForm,
    [key]: value
  }
})

// View
export const MessageForm = ({messageForm = messageForm || init}) => (
  <form method="post" class="message-form" onsubmit={HandleMessageForm}>
    <input
      type="text"
      name="text"
      id="text"
      value={messageForm.text}
      oninput={(state, ev) => SetMessageForm(state, 'text', ev.target.value)}
    />
    <button type="submit">GO</button>
  </form>
)
