import {h} from 'hyperapp'

export const Bubble = ({match}) => (state, actions) => {

  if (match.params.bubbleName != state.prevBubbleName) {
    // Join room here
    socket.emit('switch bubble', {
      prevBubbleName: state.prevBubbleName,
      nextBubbleName: match.params.bubbleName
    });
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


    {
      Object.keys(state.threads)
      .filter(thread_id => state.threads[thread_id].bubble_id == bubble._id)
      .map(thread_id => <ThreadPreview thread={state.threads[thread_id]} />)
    }
    


  </div>
)




const ThreadPreview = ({thread}) => (state, actions) => (
  <div class="thread-preview m-2 card" key={thread._id}>
    <div class="card-header">
      <div class="card-title h5">{thread.title}</div>
      <div class="card-subtitle text-gray">{thread.author}</div>
    </div>
    <div class="card-body">Body here</div>
    {/* <Route path={`/${bubble.name}/${thread._id}`} render={({ match }) => <Thread thread={thread} />} /> */}
    <div class="card-image">IMAGE HERE</div>
    <div class="card-footer"><a class="btn btn-primary" href="#cards">Search</a><a class="btn btn-link" href="#cards">Share</a></div>
  </div>
)