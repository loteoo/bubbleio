import {getStateFromStorage} from '../utils/'

export const state = getStateFromStorage() || {
  user: {
    layoutMode: "default"
  },
  bubbles: [],
  currentView: "userView",
  currentBubble: null,
  currentThread: null,
  bubbleForm: {}
}
