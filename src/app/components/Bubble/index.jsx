import {h} from 'hyperapp'
import {Socket, Location} from '../../../utils'


import {format} from 'timeago.js'

import './style.css'

const ReceiveBubble = (state, bubble) => ({
  ...state,
  bubbles: {
    ...state.bubbles,
    [bubble.name]: bubble
  }
})


const OnMount = (state) => [
  state,
  Socket.emit({
    event: 'load and join bubble',
    data: {
      bubbleName: state.location.bubbleName,
      lastBubbleName: state.location.lastBubbleName
    },
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


export const BubbleLoader = ({bubbles, bubbleName}) => (
  <div class="bubble-loader" key={bubbleName} onmount={OnMount}>
    {bubbles[bubbleName] ? <Bubble bubble={bubbles[bubbleName]} /> : 'Loading...'}
  </div>
)


const Bubble = ({bubble}) => (
  <div class="content-panel bubble" key={bubble.id}>
    <h2 class="bubble-title">{bubble.title}</h2>
    <p class="bubble-description">{bubble.description}</p>
    <div class="bubble-info">{bubble.userCount} members, {bubble.threadCount} threads. 45 active</div>
    <div class="thread-list">
      {bubble.Threads.map(thread => <ThreadPreview thread={thread} />)}
    </div>
  </div>
)