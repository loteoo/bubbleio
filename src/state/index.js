import {getStateFromStorage} from '../utils/'

export const state = getStateFromStorage() || {
  user: {
    bubble_ids: []
  },
  bubbles: {},
  threads: {},
  messages: {}
}
