import {h} from 'hyperapp'


import {Spinner} from '../../common/Spinner/Spinner.js'

import {Message} from '../Message/Message.js'

import {ThreadFooter} from '../ThreadFooter/ThreadFooter.js'
import {MessageForm} from '../MessageForm/MessageForm.js'





import './thread-panel.css'



export const ThreadPanel = () => (
  state,
  actions,
  prevThreadId = state.prevThreadId,
  nextThreadId = window.location.pathname.split('/')[2],
  thread = state.threads && state.threads[prevThreadId] ? state.threads[prevThreadId] : null
) => {

  
  
  // Handle room socket navigation
  if (nextThreadId && nextThreadId != prevThreadId) {
    // Join room here
    socket.emit('switch thread', {
      prevThreadId: prevThreadId,
      nextThreadId: nextThreadId
    });
  }


  return (
    <div class="thread-panel">
      {
        thread
          ? thread._id
            ? <Thread thread={thread} />
            : <h2>Thread not found</h2>
          : <Spinner />
      }
    </div>
  )
}









const compareAge = (messages) => (a, b) => messages[a].createdAt > messages[b].createdAt


const Thread = ({thread}) => (state, actions) => (
  <div class="thread" key={thread._id}>
    <div class="preview">
      <div class="heading">
        <h2>{thread.title}</h2>
      </div>
      <ThreadFooter thread={thread} />
    </div>
    
    <div class="messages">
      {
        Object.keys(state.messages)
        .filter(messageId => state.messages[messageId].threadId == thread._id)
        .sort(compareAge(state.messages))
        .map(messageId => <Message message={state.messages[messageId]} />)
      }
    </div>
    
    <MessageForm thread={thread} />

  </div>
)



