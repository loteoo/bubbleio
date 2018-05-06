import {location} from "@hyperapp/router"
import {ObjectId, mergeStates, storeStateInStorage} from '../utils/'


export const actions = {
  location: location.actions,
  updateState: newState => state => {
    // console.log("Update state");
    // console.log(newState);
    return mergeStates(state, newState)
  },
  deleteBubble: bubbleToRemove => state => {

    state.bubbles = state.bubbles.filter(bubble => bubble._id != bubbleToRemove._id);

    storeStateInStorage(state);

    return {
      bubbles: state.bubbles
    }
  },
  deleteThread: threadToRemove => state => {

    for (var i = 0; i < state.bubbles.length; i++) {
      if (state.bubbles[i]._id == threadToRemove.bubble_id) {
        state.bubbles[i].threads = state.bubbles[i].threads.filter(thread => thread._id != threadToRemove._id);
      }
    }
    storeStateInStorage(state);
    return {
      bubbles: state.bubbles
    }
  }
}
