import {h} from 'hyperapp'

import {Socket, Location} from '../../../utils'

import {MessageForm} from '../MessageForm'

// Trigger css slidein transition
const slideIn = el => {
  el.classList.add('hidden')
  void el.clientHeight
  el.classList.remove('hidden')
}

// Trigger css slideout transition
const slideOut = (el, done) => {
  el.classList.add('hidden')
  setTimeout(done, 200)
}




const ReceiveThread = (state, {thread, messages}) => ({
  ...state,
  threads: {
    ...state.threads,
    [thread.id]: thread
  },
  messages: messages.reduce(
    (messages, message) => ({...messages, [message.id]: message}),
    state.messages
  )
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
  <div key={message.id}>{message.text}</div>
)


export const Thread = ({thread, messages, messageForm}) => thread && (
  <div class="thread content-panel" key={thread.id} onmount={OnMount} onCreate={slideIn} onRemove={slideOut} >
    <button onclick={(state) => [state, Location.go({to: '/' + state.location.bubbleName})]}>Back</button>
    <h2>{thread.title}</h2>
    <p>{thread.text}</p>
    <div class="list">
      {
        Object.keys(messages)
          .filter(messageId => messages[messageId].ThreadId === thread.id)
          .map(messageId => <Message message={messages[messageId]} />)
      }
    </div>
    <MessageForm messageForm={messageForm} />
  </div>
)



