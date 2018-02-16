import {location} from "@hyperapp/router"
import {getStateFromStorage} from '../utils/'

export const state = getStateFromStorage() || {
  username: "",
  bubbles: [
    {
      _id: "5a74686329a75f26cc07c71d",
      author: "loteoo",
      created: "6517949455382085633",
      desc: "Lorem ipsum",
      name: "general",
      title: "General bubble",
      userCount: 0
    }
  ],
  currentView: "globalView",
  currentBubble: null,
  currentThread: null,
  keyboardStatus: "closed",
  keyboardMode: "default"
}
