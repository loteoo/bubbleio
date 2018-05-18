import {getStateFromStorage} from '../utils/'

export const state = getStateFromStorage() || {
  user: {
    bubbleList: []
  },
  bubbles: {},
  threads: {},
  messages: {}
}
