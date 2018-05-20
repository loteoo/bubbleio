import {h} from 'hyperapp'

export const Bubble = ({match}) => (state, actions) => {

  // Join room here
  socket.emit('switch bubble', {
    prevBubbleName: '',
    nextBubbleName: match.params.bubbleName
  });

  if (state.bubbles[match.params.bubbleName]) {
    let bubble = state.bubbles[match.params.bubbleName];
    return (
      <div key={bubble._id}>
        <h1>{bubble.title}</h1>
      </div>
    )
  } else {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    )
  }
}
