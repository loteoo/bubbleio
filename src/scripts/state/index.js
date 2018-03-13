import {getStateFromStorage} from '../utils/'

export const state = getStateFromStorage() || {
  user: {},
  bubbles: [],
  currentView: "userView",
  currentBubble: null,
  currentThread: null,
  bubbleForm: {}
}
