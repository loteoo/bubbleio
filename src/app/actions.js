import {init} from './init'

// ====================
// Global app actions
// ====================

// Sets the a value to the given key in the state
export const ToggleMenu = (state) => ({
  ...state,
  menuOpened: !state.menuOpened
})


export const ReceiveBubbles = (state, bubbles) => ({
  ...state,
  menuBubbles: bubbles
})

export const ParseUrl = (state, path) => {
  const parts = path.split('/').filter((part, index) => index !== 0)
  const bubbleName = parts[0]
  const threadId = parts[1]
  const currentBubble = state.bubbles[bubbleName]
  const currentThread = state.threads[threadId]
  return {
    ...state,
    location: {
      path,
      bubbleName: bubbleName,
      threadId: threadId,
      lastBubbleName: state.location.bubbleName,
      lastThreadId: state.location.threadId
    },
    meta: {
      title: currentThread ? currentThread.title : currentBubble ? currentBubble.title : init.meta.title,
      description: currentThread ? currentThread.description : currentBubble ? currentBubble.description : init.meta.description
    }
  }
}
