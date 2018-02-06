import {location} from "@hyperapp/router"
import {getStateFromStorage} from '../utils/'

export const state = getStateFromStorage() || {
  username: "",
  bubbles: [],
  currentView: "globalView",
  currentBubble: null,
  currentThread: null,
  keyboardStatus: "closed",
  keyboardMode: "default",
  gravity: 1.8
}
