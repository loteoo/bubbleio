import {location} from "@hyperapp/router"
import {getStateFromStorage} from '../utils/'

export const state = getStateFromStorage() || {
  location: location.state,
  user: {
    bubble_names: []
  },
  bubbles: {},
  threads: {},
  messages: {},
  newBubbleForm: {},
  prevBubbleName: null,
  prevThreadName: null,
}
