import {h} from 'hyperapp'


import {ThreadItem} from '../ThreadItem/ThreadItem.js'

import './bubble.css'


export const Bubble = ({bubble}) => (state, actions) => (
  <div class="bubble" key={bubble._id}>

    <div class="heading">
      <h1>{bubble.title}</h1>
    </div>

    <div class="threads">
      {
        Object.keys(state.threads)
        .filter(threadId => state.threads[threadId].bubbleId == bubble._id)
        .map(threadId => <ThreadItem thread={state.threads[threadId]} bubble={bubble} />)
      }
    </div>
    


  </div>
)




