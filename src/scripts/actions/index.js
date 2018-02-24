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
  keyboardSubmit: ev => (state, actions) => {
    ev.preventDefault();
    if (ev.target.title.value) {

      let timestamp = new Date().getTime();

      if (state.currentView == "bubbleView") {



        // Create the thread object
        let thread = {
          _id: ObjectId(),
          title: ev.target.title.value,
          score: 0,
          created: timestamp,
          type: state.keyboardMode,
          author: state.user.username,
          bubble_id: state.currentBubble._id
        }

        if (state.keyboardMode == "text") {
          thread.text = ev.target.text.value;
        } else if (state.keyboardMode == "link") {
          thread.url = ev.target.link.value;
        } else if (state.keyboardMode == "image") {
          thread.src = ev.target.image_link.value;
        }


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
          sender: state.user.username,
          message: ev.target.title.value,
          created: timestamp
        }

        // Append message to list
        actions.updateState({
          bubbles: [
            {
              _id: message.bubble_id,
              threads: [
                {
                  _id: message.thread_id,
                  messages: [
                    message
                  ]
                }
              ]
            }
          ]
        });


        // Send new message to server
        socket.emit('new message', message);


      }

      state.keyboardMode = "default";
      ev.target.reset();
      return true
    }
  },
  updateState: newState => state => {
    // console.log("Update state");
    // console.log(newState);
    return mergeStates(state, newState)
  }
}
