import {location} from "@hyperapp/router"
import {getStateFromStorage} from '../utils/'

export const state = getStateFromStorage() || {
  user: {
    username: ""
  },
  bubbles: [],
  currentView: "globalView",
  currentBubble: null,
  currentThread: null,
  keyboardStatus: "closed",
  keyboardMode: "default"
}
