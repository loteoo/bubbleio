import {h} from 'hyperapp'

export const Thread = ({match}) => (state, actions) => {

  if (match.params.threadId != state.prevThreadId) {
    // Join room here
    socket.emit('switch thread', {
      prevThreadId: state.prevThreadId,
      nextThreadId: match.params.threadId
    });
  }

  if (state.threads && state.threads[match.params.threadId]) {
    return <ThreadView thread={state.threads[match.params.threadId]} />
  } else {
    return (
      <div class="container">
        <div class="loading loading-lg"></div>
      </div>
    )
  }
}



const ThreadView = ({thread}) => (state, actions) => (
  <div class="container" key={thread._id}>
    <h1>{thread.title}</h1>
    <p>{thread.desc}</p>

    
  </div>
)




const Message = ({message}) => (state, actions) => (
  <div class="container" key={thread._id}>
    <h1>{message.message}</h1>
    <p>{message.author}</p>

    
  </div>
)