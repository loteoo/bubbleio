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
        .filter(thread_id => state.threads[thread_id].bubble_id == bubble._id)
        .map(thread_id => <ThreadItem thread={state.threads[thread_id]} bubble={bubble} />)
      }
    </div>
    


  </div>
)




