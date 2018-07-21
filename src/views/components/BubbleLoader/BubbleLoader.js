
import {h} from 'hyperapp'

import {Bubble} from '../Bubble/Bubble.js'


export const BubbleLoader = ({match}) => (state, actions) => {
  
  // Handle room socket navigation
  if (match.params.bubbleName != state.prevBubbleName) {
    // Join room here
    socket.emit('switch bubble', {
      prevBubbleName: state.prevBubbleName,
      nextBubbleName: match.params.bubbleName
    });
  }

  // Loading screen if not loaded
  if (state.bubbles && state.bubbles[match.params.bubbleName]) {
    return <Bubble bubble={state.bubbles[match.params.bubbleName]} />
  } else {
    return (
      <div key="loading">
        Loading...
      </div>
    )
  }
}

  