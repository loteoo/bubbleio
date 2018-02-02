import {location} from "@hyperapp/router"
import {getStateFromStorage} from '../utils/'

export const state = getStateFromStorage() || {
  username: "",
  bubbles: [],
  currentView: "globalView",
  currentBubble: null,
  currentThread: null,
  keyboardVal: "",
  keyboardStatus: "closed",
  gravity: 1.8
}
