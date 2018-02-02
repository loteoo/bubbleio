import {location} from "@hyperapp/router"
import {getStateFromStorage} from '../utils/'

export const state = getStateFromStorage() || {
  location: location.state,
  username: "",
  bubbles: [],
  currentView: "globalView",
  currentBubble: {
    name: "all",
    threads: []
  },
  currentThread: null,
  keyboardVal: "",
  keyboardStatus: "closed",
  gravity: 1.8
}
