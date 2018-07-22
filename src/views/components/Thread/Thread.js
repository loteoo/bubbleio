import {h} from 'hyperapp'

import {Message} from '../Message/Message.js'

export const Thread = ({thread}) => (state, actions) => (
  <div class="thread" key={thread._id}>
    <h2>{thread.title}</h2>
    
    <Messages thread={thread} />
    

  </div>
)

const Messages = ({thread}) => (state, actions) => (
  <div class="messages">
    {
      Object.keys(state.messages)
      .filter(message_id => state.messages[message_id].thread_id == thread._id)
      .map(message_id => <Message message={state.messages[message_id]} />)
    }
  </div>
)
