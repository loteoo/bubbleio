
import {h} from 'hyperapp'


import {Spinner} from '../../common/Spinner/Spinner.js'


import {FourOFour} from '../FourOFour/FourOFour.js'
import {ThreadItem} from '../ThreadItem/ThreadItem.js'
import {NewThreadForm} from '../NewThreadForm/NewThreadForm.js'

import './bubble-view.css'


export const BubbleView = () => (
  state,
  actions,
  prevBubbleName = state.prevBubbleName,
  nextBubbleName = window.location.pathname.split('/')[1],
  bubble = state.bubbles && state.bubbles[prevBubbleName] ? state.bubbles[prevBubbleName] : null
) => {

  
  
  // Handle room socket navigation
  if (nextBubbleName && nextBubbleName != prevBubbleName) {
    // Join room here
    socket.emit('switch bubble', {
      prevBubbleName: prevBubbleName,
      nextBubbleName: nextBubbleName
    });
  }




  return (
    <div class="bubble-view">
      {
        bubble
          ? bubble._id
            ? <Bubble bubble={bubble} />
            : <FourOFour />
          : <Spinner />
      }
    </div>
  )
}





// Calculates relevance for a thread
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



const Bubble = ({bubble}) => (state, actions) => (
  <div class="bubble" key={bubble._id}>

    <div class="heading">
      <h1>{bubble.title}</h1>
    </div>

    <div class="listing">
      {
        Object.keys(state.threads) // Go through all threads
        .filter(threadId => state.threads[threadId].bubbleId == bubble._id) // Only the ones from this bubble
        .sort(compareRelevance(state.threads)) // Sort thread by relevance
        .map(threadId => <ThreadItem thread={state.threads[threadId]} bubble={bubble} />) // Map to the component
      }
    </div>
    
    { state.newThreadForm && state.newThreadForm.opened ? <NewThreadForm bubble={bubble} /> : null }

  </div>
)



