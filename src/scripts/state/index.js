import {getStateFromStorage} from '../utils/'

export const state = getStateFromStorage() || {
  user: {
    layoutMode: "compact"
  },
  bubbles: [],
  currentView: "userView",
  currentBubble: null,
  currentThread: null,
  bubbleForm: {}
}
