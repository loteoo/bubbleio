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
  menuBubbles: bubbles.map(bubble => bubble.name),
  bubbles: bubbles.reduce((bubbles, bubble) => ({...bubbles, [bubble.name]: bubble}), state.bubbles)
})

export const ParseUrl = (state, path) => {
  const parts = path.split('/').filter((part, index) => index !== 0)
  return {
    ...state,
    location: {
      path,
      bubbleName: parts[0] || '',
      threadId: parts[1] || '',
      lastBubbleName: state.location.bubbleName,
      lastThreadId: state.location.threadId
    }
  }
}
