import {h} from 'hyperapp'


import {ThreadItem} from '../ThreadItem/ThreadItem.js'


export const Bubble = ({bubble}) => (state, actions) => (
  <div class="container" key={bubble._id}>
    <h1>{bubble.title}</h1>
    <p>{bubble.desc}</p>


    {
      Object.keys(state.threads)
      .filter(thread_id => state.threads[thread_id].bubble_id == bubble._id)
      .map(thread_id => <ThreadItem thread={state.threads[thread_id]} bubble={bubble} />)
    }
    


  </div>
)




