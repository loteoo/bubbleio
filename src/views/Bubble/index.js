import {h} from 'hyperapp'

export const Bubble = ({match}) => (state, actions) => {

  if (match.params.bubbleName != state.prevBubbleName) {
    // Join room here
    // socket.emit('switch bubble', {
    //   prevBubbleName: state.prevBubbleName,
    //   nextBubbleName: match.params.bubbleName
    // });
  }

  if (state.bubbles && state.bubbles[match.params.bubbleName]) {
    return <BubbleView bubble={state.bubbles[match.params.bubbleName]} />
  } else {
    return (
      <div class="container">
        <div class="loading loading-lg"></div>
      </div>
    )
  }
}





const BubbleView = ({bubble}) => (state, actions) => (
  <div class="container" key={bubble._id}>
    <h1>{bubble.title}</h1>
    <p>{bubble.desc}</p>
  </div>
)




const ThreadPreview = ({thread, bubble}) => (state, actions) => (
  <div class="container" key={thread._id}>

    <h3>{thread.title}</h3>
  
    <Route path={`/${bubble.name}/${thread._id}`} render={({ match }) => <Thread thread={thread} />} />

  </div>
)