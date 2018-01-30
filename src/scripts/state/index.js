import {location} from "@hyperapp/router"

export const state = {
  location: location.state,
  username: "loteoo",
  bubbles: [],
  currentView: "globalView",
  currentBubble: null,
  currentThread: null,
  keyboardVal: "",
  keyboardStatus: "closed"
}
