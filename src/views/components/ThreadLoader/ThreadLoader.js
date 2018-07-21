import {h} from 'hyperapp'

import {Thread} from '../Thread/Thread.js'

export const ThreadLoader = ({match}) => (state, actions) => {

  if (match.params.threadId != state.prevThreadId) {
    // Join room here
    socket.emit('switch thread', {
      prevThreadId: state.prevThreadId,
      nextThreadId: match.params.threadId
    });
  }

  if (state.threads && state.threads[match.params.threadId]) {
    return <Thread thread={state.threads[match.params.threadId]} />
  } else {
    return (
      <div key="loading">
        Loading...
      </div>
    )
  }
}






