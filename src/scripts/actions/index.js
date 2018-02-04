import {location} from "@hyperapp/router"
import {ObjectId, storeStateInStorage, mergeUniqueId} from '../utils/'
import {deepmerge} from '../utils/deepmerge.js'


export const actions = {
  location: location.actions,
  setGravity: gravity => ({gravity: gravity}),
  login: ev => state => {
    ev.preventDefault();
    return { username: ev.target[0].value };
  },
  upvote: thread => (state, actions) => {
    socket.emit('thread upvote', thread);
    return { score: thread.score++ }
  },
  expandKeyboard: status => {
    if (status == "closed") {
      return { keyboardStatus: "opened" }
    } else {
      return { keyboardStatus: "closed" }
    }
  },
  keyboardSubmit: ev => state => {
    ev.preventDefault();
    if (ev.target[0].value) {

      let timestamp = new Date().getTime();

      if (state.currentView == "bubbleView") {


        // Create the thread object
        let thread = {
          _id: ObjectId(),
          title: ev.target[0].value,
          score: 0,
          created: timestamp,
          type: "message",
          author: state.username,
          bubble_id: state.currentBubble._id
        }


        // Append thread to list
        state.currentBubble.threads.unshift(thread)

        setTimeout(() => { // Scroll to top after the re-render/update cycle has ended (to include the new element's height)
          var threadList = document.querySelector(".bubble-view .frame");
          threadList.scrollTop = 0;
        }, 10)


        // Send new thread to server
        socket.emit('new thread', thread);

      } else {

        // Create the message object
        let message = {
          _id: ObjectId(),
          bubble_id: state.currentThread.bubble_id,
          thread_id: state.currentThread._id,
          sender: state.username,
          message: ev.target[0].value,
          created: timestamp
        }

        // Append message to list
        state.currentThread.messages.push(message)


        // Send new message to server
        socket.emit('new message', message);

         // Scroll to bottom after the re-render/update cycle has ended (to include the new element's height)
        setTimeout(() => { // TODO: do something less sketchy
          var messagesList = document.querySelector(".thread-view .frame");
          messagesList.scrollTop = messagesList.scrollHeight;
        }, 10);

      }
      return true
    }
  },
  updateState: newState => state => {
    console.log("State updated");
    console.log(newState);
    return deepmerge(state, newState, { arrayMerge: mergeUniqueId })
  },
  loadMoreThreads: () => (state, actions) => {
    console.log("load more in "+state.currentBubble.name+" !");

    fetch("/get/" + state.currentBubble.name)
      .then(response => response.json())
      .then(data => {

        actions.updateState(data);


        storeStateInStorage(state);

      });

  },
  loadMoreMessages: () => (state, actions) => {
    console.log("load messages in "+state.currentThread.title+" !");

    fetch("/get/" + state.currentBubble.name + "/" + state.currentThread._id)
      .then(response => response.json())
      .then(data => {

        actions.updateState(data);


        storeStateInStorage(state);

      });

  },
}
