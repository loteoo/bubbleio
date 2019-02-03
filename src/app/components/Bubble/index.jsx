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
  threads: threads.reduce(
    (threads, thread) => ({...threads, [thread.id]: thread}),
    state.threads
  )
})


const OnMount = (state) => [
  state,
  Socket.emit({
    event: 'load and join bubble',
    data: state.location.bubbleName,
    action: ReceiveBubble
  })
]


const ThreadPreview = ({thread}) => (
  <div class="thread-preview">
    <h4>
      <a onclick={(state) => [state, Location.go({to: '/' + state.location.bubbleName + '/' + thread.id})]}>
        {thread.title}
      </a>
    </h4>
    {
      thread.type === 'image'
        ? <img src={thread.image + '?id=' + thread.id} />
        : thread.type === 'link' ? <a href={thread.link}></a>
          : <p>{thread.text}</p>
    }
  </div>
)


export const Bubble = ({bubble, threads}) => bubble && (
  <div class="content-panel bubble" key={bubble.id} onmount={OnMount}>
    <div class="inner">
      <h2>{bubble.title}</h2>
      <p>{bubble.description}</p>
      <ul>
        {bubble.threadIds && bubble.threadIds.map(threadId => <ThreadPreview thread={threads[threadId]} />)}
      </ul>
    </div>
  </div>
)
