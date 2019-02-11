import {h} from 'hyperapp'

import {format} from 'timeago.js'

import './style.css'

import {Socket, Location} from '../../../utils'

import {MessageForm} from '../MessageForm'
import {PickNameForm} from '../PickNameForm'

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




const ReceiveThread = (state, thread) => ({
  ...state,
  threads: {
    ...state.threads,
    [thread.id]: thread
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
  <div class="message" key={message.id}>
    <div class="info">
      <b>{message.User.name}</b>
      <span>{format(message.createdAt)}</span>
    </div>
    <div class="text">{message.text}</div>
  </div>
)


export const Thread = ({thread, messageForm, pickNameForm, user}) => {
  if (thread) {
    return (
      <div class="thread content-panel" key={thread.id} onmount={OnMount} onCreate={slideIn} onRemove={slideOut} >
        <div class="header">
          <button onclick={(state) => [state, Location.go({to: '/' + state.location.bubbleName})]}>Back</button>
          <h2>{thread.title}</h2>
          <p>{thread.text}</p>
        </div>
        <div class="message-list">
          {thread.Messages && (
            <div class="scroller" onCreate={el => { el.scrollTop = el.scrollHeight }}>
              {thread.Messages.map(message => <Message message={message} />)}
            </div>
          )}
        </div>
        <div class="bottom">
          {
            user
              ? <MessageForm messageForm={messageForm} />
              : <PickNameForm pickNameForm={pickNameForm} />
          }
        </div>
      </div>
    )
  }
}



