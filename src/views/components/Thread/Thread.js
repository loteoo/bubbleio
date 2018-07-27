import {h} from 'hyperapp'

import {Message} from '../Message/Message.js'

import {MessageForm} from '../MessageForm/MessageForm.js'

import './thread.css'

export const Thread = ({thread}) => (state, actions) => (
  <div class="thread" key={thread._id}>
    <div class="heading">
      <h2>{thread.title}</h2>
    </div>
    
    <Messages thread={thread} />
    
    <MessageForm thread={thread} />

  </div>
)

const Messages = ({thread}) => (state, actions) => (
  <div class="messages">
    {
      Object.keys(state.messages)
      .filter(messageId => state.messages[messageId].threadId == thread._id)
      .map(messageId => <Message message={state.messages[messageId]} />)
    }
  </div>
)
