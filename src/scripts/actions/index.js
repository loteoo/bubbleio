import {location} from "@hyperapp/router"
import {ObjectId, mergeStates} from '../utils/'


export const actions = {
  location: location.actions,
  upvote: thread => (state, actions) => {
    socket.emit('thread upvote', thread);
    thread.score++;
    thread.upvoted++;
    // Append thread to list
    actions.updateState({
      bubbles: [
        {
          _id: thread.bubble_id,
          threads: [
            thread
          ]
        }
      ]
    });
  },
  updateState: newState => state => {
    // console.log("Update state");
    // console.log(newState);
    return mergeStates(state, newState)
  }
}
