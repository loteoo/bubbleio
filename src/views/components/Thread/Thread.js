import {h} from 'hyperapp'

export const Thread = ({thread}) => (state, actions) => (
  <div class="container" key={thread._id}>
    <h1>{thread.title}</h1>
    <p>{thread.desc}</p>

    
  </div>
)
