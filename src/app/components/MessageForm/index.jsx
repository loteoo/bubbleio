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
  messages: {
    ...state.messages,
    [message.id]: {
      ...message
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
        message: ''
      }
    },
    Socket.emit({
      event: 'new message',
      data: state.messageForm.message,
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
    <TextInput
      name="message"
      label="New message"
      placeholder="Type something..."
      value={messageForm.message}
      setter={SetMessageForm}
    />
  </form>
)
