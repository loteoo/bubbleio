import {location} from "@hyperapp/router"
import {ObjectId, mergeStates, storeStateInStorage} from '../utils/'


export const actions = {
  location: location.actions,
  updateState: newState => state => {
    // console.log("Update state");
    // console.log(newState);
    return mergeStates(state, newState)
  },
  removeThread: archivedThread => state => {


    for (var i = 0; i < state.bubbles.length; i++) {
      if (state.bubbles[i]._id == archivedThread.bubble_id) {
        state.bubbles[i].threads = state.bubbles[i].threads.filter(thread => thread._id != archivedThread._id);
      }
    }

    storeStateInStorage(state);
    return true;
  }
}
