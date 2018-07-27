import {h} from 'hyperapp'

import {ThreadItem} from '../ThreadItem/ThreadItem.js'
import {ThreadForm} from '../ThreadForm/ThreadForm.js'

import './bubble.css'



// Calculates relevance between threads
//
// Score = (S + M/2) / T^G
//
// where,
// S = points of a thread
// M = total messages in a thread
// T = time since submission (in hours)
// G = Gravity, defaults to 1.8
const calculateRelevance = (thread) => (thread.score + ((thread.messageCount/2) || 0) + 1) / Math.pow(((new Date() - new Date(thread.createdAt)) / 3600000), 1.8)

// Compares relevance between two threads
const compareRelevance = (threads) => (a, b) => calculateRelevance(threads[a]) < calculateRelevance(threads[b])



export const Bubble = ({bubble}) => (state, actions) => (
  <div class="bubble" key={bubble._id}>

    <div class="heading">
      <h1>{bubble.title}</h1>
    </div>

    <div class="threads">
      {
        Object.keys(state.threads)
        .filter(threadId => state.threads[threadId].bubbleId == bubble._id)
        .sort(compareRelevance(state.threads))
        .map(threadId => <ThreadItem thread={state.threads[threadId]} bubble={bubble} />)
      }
    </div>
    
    <ThreadForm bubble={bubble} />

  </div>
)




