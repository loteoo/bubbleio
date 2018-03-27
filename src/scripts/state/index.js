import {getStateFromStorage} from '../utils/'

export const state = getStateFromStorage() || {
  user: {
    layoutMode: "preview"
  },
  bubbles: [],
  currentView: "userView",
  currentBubble: null,
  currentThread: null,
  bubbleForm: {}
}
