import {location} from "@hyperapp/router"

export const state = {
  location: location.state,
  username: "loteoo",
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
