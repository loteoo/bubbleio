import {location} from "@hyperapp/router"
import {mergeUniqueId} from '../utils/'

export const actions = {
  location: location.actions,
  upvote: thread => {
    socket.emit('thread upvote', thread.id);
    return { score: thread.score++ }
  },
  expandKeyboard: status => {
    if (status == "closed") {
      return { keyboardStatus: "opened" }
    } else {
      return { keyboardStatus: "closed" }
    }
  },
  keyboardSubmit: e => state => {
    e.preventDefault();
    if (e.target[0].value) {

      // TODO : Timestamp should be calculated on the server when saving to DB
      let timestamp = new Date().getTime(); // Milliseconds, not seconds, since epoch


      if (state.currentView == "bubbleView") {
        // Create thread and push to DB
        state.currentBubble.threads.unshift({
          id: Math.floor(Math.random()*100),
          title: e.target[0].value,
          score: 1,
          created: timestamp,
          type: "message",
          author: state.username,
          messages: []
        })
        setTimeout(() => { // Scroll to top after the re-render/update cycle has ended (to include the new element's height)
          var threadList = document.querySelector(".bubble-view .frame");
          threadList.scrollTop = 0;
        }, 10)
      } else {

        let message = {
          bubbleName: state.currentBubble.name,
          threadId: state.currentThread.id,
          message: {
            sender: state.username,
            message: e.target[0].value,
            created: timestamp
          }
        }

        // Append message to list
        state.currentThread.messages.push(message.message)


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
  receiveMessage: message => state => {
    console.log(message);

    // Append received message to message list
    let bubble = state.bubbles.find(bubble => bubble.name === message.bubbleName); // TODO: DO THIS BETTER MORE OPTIMISATIONATION
    let thread = bubble.threads.find(thread => thread.id === message.threadId); // TODO: DO THIS BETTER MORE OPTIMISATIONATION
    thread.messages.push(message.message);

    setTimeout(() => { // TODO: do something less sketchy
      var messagesList = document.querySelector(".thread-view .frame");
      messagesList.scrollTop = messagesList.scrollHeight;
    }, 10);

    return true
  },
  receiveNewThread: thread => state => {
    console.log(thread);
    let bubble = state.bubbles.find(bubble => bubble.name === thread.bubbleName); // TODO: DO THIS BETTER MORE OPTIMISATIONATION
    bubble.threads.push(thread.thread);

    // TODO Threads should be re-ordered by our score algorithm
    return true
  },
  updateAppData: newData => state => {

    let newState = {
      bubbles: mergeUniqueId(state.bubbles, newData, "_id")
    }

    return newState;
  },
  loadMoreThreads: e => state => {
    console.log("load more in "+state.currentBubble.name+" !");

    // fetch(window.location.host + "/get/" + state.currentBubble.name)
    //   .then(response => response.json())
    //   .then(data => {
    //
    //     console.log(data)
    //   });
  }
}
