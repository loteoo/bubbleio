import {h} from 'hyperapp'

import {Socket, Location} from '../../../utils'

const ReceiveThread = (state, {thread, messages}) => ({
  ...state,
  threads: {
    ...state.threads,
    [thread.id]: {
      ...thread,
      messages
    }
  }
})


const OnMount = (state) => [
  state,
  Socket.emit({
    event: 'load and join thread',
    data: state.location.threadId,
    action: ReceiveThread
  })
]


const Message = ({message}) => (
  <li key={message.id}>{message.text}</li>
)


export const Thread = ({thread}) => thread && (
  <div class="thread content-panel" key={thread.id} onmount={OnMount}>
    <button onclick={(state) => [state, Location.go({to: '/' + state.location.bubbleName})]}>Back</button>
    <h2>{thread.title}</h2>
    <p>{thread.text}</p>
    <ul>
      {thread.messages && thread.messages.map(message => <Message message={message} />)}
    </ul>
  </div>
)
