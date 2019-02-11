import {h} from 'hyperapp'
import {Socket, Location} from '../../../utils'


import {format} from 'timeago.js'

import './style.css'

const ReceiveBubble = (state, {bubble, threads}) => ({
  ...state,
  bubbles: {
    ...state.bubbles,
    [bubble.name]: bubble
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
    data: state.location,
    action: ReceiveBubble
  })
]


const ThreadPreview = ({thread}) => (
  <a
    class="thread-preview"
    key={thread.id}
    onclick={(state) => [state, Location.go({to: '/' + state.location.bubbleName + '/' + thread.id})]}
  >
    <div class="thumbnail"></div>
    <div class="content">
      <h4 class="title">{thread.title}</h4>
      <div class="info">
        {thread.User.name}, {format(thread.createdAt)}
      </div>
      {/* {
        thread.type === 'image'
          ? <img src={thread.image + '?id=' + thread.id} />
          : thread.type === 'link' ? <a href={thread.link}></a>
            : <p>{thread.text}</p>
      } */}
    </div>
  </a>
)


export const Bubble = ({bubble, threads}) => bubble && (
  <div class="content-panel bubble" key={bubble.id} onmount={OnMount}>
    <h2 class="bubble-title">{bubble.title}</h2>
    <p class="bubble-description">{bubble.description}</p>
    <div class="bubble-info">738 members, 1293 threads. 45 active</div>
    <div class="thread-list">
      {
        Object.keys(threads)
          .filter(threadId => threads[threadId].BubbleId === bubble.id)
          .map(threadId => <ThreadPreview thread={threads[threadId]} />)
      }
    </div>
  </div>
)
