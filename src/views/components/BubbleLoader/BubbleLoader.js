
import {h} from 'hyperapp'

import {Bubble} from '../Bubble/Bubble.js'
import {Spinner} from '../../common/Spinner/Spinner.js'


export const BubbleLoader = () => (state, actions) => {

  let nextBubbleName = window.location.pathname.split('/')[1];
  
  // Handle room socket navigation
  if (nextBubbleName && nextBubbleName != state.prevBubbleName) {
    // Join room here
    socket.emit('switch bubble', {
      prevBubbleName: state.prevBubbleName,
      nextBubbleName: nextBubbleName
    });
  }

  // Loading screen if not loaded
  if (state.bubbles && state.bubbles[state.prevBubbleName]) {
    return <Bubble bubble={state.bubbles[state.prevBubbleName]} />
  } else {
    return (
      <div key="loading">
        <Spinner />
      </div>
    )
  }
}

  