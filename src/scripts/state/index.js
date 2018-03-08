import {location} from "@hyperapp/router"
import {getStateFromStorage} from '../utils/'

export const state = getStateFromStorage() || {
  user: {},
  bubbles: [],
  currentView: "userView",
  currentBubbleName: null,
  currentThreadId: null
}
