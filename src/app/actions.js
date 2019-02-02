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
  bubbles
})
