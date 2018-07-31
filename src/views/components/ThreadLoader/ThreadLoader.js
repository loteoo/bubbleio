import {h} from 'hyperapp'

import {Thread} from '../Thread/Thread.js'
import {Spinner} from '../../common/Spinner/Spinner.js'

export const ThreadLoader = () => (state, actions) => {

  let nextThreadId = window.location.pathname.split('/')[2];

  if (nextThreadId && nextThreadId != state.prevThreadId) {
    // Join room here
    socket.emit('switch thread', {
      prevThreadId: state.prevThreadId,
      nextThreadId: nextThreadId
    });
  }

  if (state.threads && state.threads[state.prevThreadId]) {
    return <Thread thread={state.threads[state.prevThreadId]} />
  } else {
    return (
      <div key="loading">
        <Spinner />
      </div>
    )
  }
}






