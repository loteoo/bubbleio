import {location} from "@hyperapp/router"
import {ObjectId, mergeStates} from '../utils/'


export const actions = {
  location: location.actions,
  updateState: newState => state => {
    // console.log("Update state");
    // console.log(newState);
    return mergeStates(state, newState)
  }
}
