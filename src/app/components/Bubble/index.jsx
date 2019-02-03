import {h} from 'hyperapp'
import {Socket, Location} from '../../../utils'


const ReceiveBubble = (state, {bubble, threads}) => ({
  ...state,
  bubbles: {
    ...state.bubbles,
    [bubble.name]: {
      ...bubble,
      threadIds: threads.map(thread => thread.id)
    }
  },
  threads: threads.reduce((threads, thread) => ({...threads, [thread.id]: thread}), state.threads)
})


const OnMount = (state) => [
  state,
  Socket.emit({
    event: 'load and join bubble',
    data: state.location.bubbleName,
    action: ReceiveBubble
  })
]


const Thread = ({thread}) => (
  <div class="thread">
    <h4>
      <a onclick={(state) => [state, Location.go({to: '/' + state.location.bubbleName + '/' + thread.id})]}>
        {thread.title}
      </a>
    </h4>
  </div>
)


export const Bubble = ({bubble, threads}) => bubble && (
  <div class="bubble" key={bubble.id} onmount={OnMount}>
    <div class="inner">
      <h2>{bubble.title}</h2>
      <p>{bubble.description}</p>
      <ul>
        {bubble.threadIds && bubble.threadIds.map(threadId => <Thread thread={threads[threadId]} />)}
      </ul>
    </div>
  </div>
)
