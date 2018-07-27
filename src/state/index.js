import {location} from "@hyperapp/router"
import {getStateFromStorage} from '../utils/'

export const state = getStateFromStorage() || {
  location: location.state,
  bubbles: {},
  threads: {},
  messages: {}
}
