import {location} from "@hyperapp/router"
import {mergeUniqueId, ObjectId} from '../utils/'

export const actions = {
  location: location.actions,
  setGravity: gravity => ({gravity: gravity}),
  upvote: thread => (state, actions) => {
    socket.emit('thread upvote', {
      bubbleName: state.currentBubble.name,
      threadId: thread._id
    });
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

      let timestamp = new Date().getTime();

      if (state.currentView == "bubbleView") {


        // Create the thread object
        let thread = {
          _id: ObjectId(),
          title: e.target[0].value,
          score: 1,
          created: timestamp,
          type: "message",
          author: state.username
        }

        console.log(thread._id);

        // Append thread to list
        state.currentBubble.threads.unshift(thread)
        setTimeout(() => { // Scroll to top after the re-render/update cycle has ended (to include the new element's height)
          var threadList = document.querySelector(".bubble-view .frame");
          threadList.scrollTop = 0;
        }, 10)


        // Send new message to server
        socket.emit('new thread', {
          bubble: state.currentBubble,
          thread: thread
        });

      } else {

        // Create the message object
        let message = {
          bubbleName: state.currentBubble.name,
          threadId: state.currentThread._id,
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

    // Append received message to message list
    let bubble = state.bubbles.find(bubble => bubble.name === message.bubbleName); // TODO: DO THIS BETTER MORE OPTIMISATIONATION
    let thread = bubble.threads.find(thread => thread._id === message.threadId); // TODO: DO THIS BETTER MORE OPTIMISATIONATION
    thread.messages.push(message.message);

    setTimeout(() => { // TODO: do something less sketchy
      var messagesList = document.querySelector(".thread-view .frame");
      messagesList.scrollTop = messagesList.scrollHeight;
    }, 10);

    return true
  },
  updateUserBubbles: bubblesData => (state, actions) => {
    state.bubbles = mergeUniqueId(state.bubbles, bubblesData, "_id")
    return true;
  },
  updateBubbleUserCounts: bubblesData => (state, actions) => {
    Object.keys(bubblesData).forEach(function(bubbleName) {
      let bubble = state.bubbles.find(bubble => bubble.name === bubbleName);
      if (bubble) {
        bubble.userCount = bubblesData[bubbleName].userCount;
      }
    });
    return true;
  },
  addBubbleThreads: threadsData => (state, actions) => {
    let bubble = state.bubbles.find(bubble => bubble.name === threadsData.bubbleName);
    if (!bubble.threads) {
      bubble.threads = [];
    }
    if (bubble) {
      bubble.threads = mergeUniqueId(bubble.threads, threadsData.threads, "_id")
    }
    return true;
  },
  loadMoreThreads: () => (state, actions) => {
    console.log("load more in "+state.currentBubble.name+" !");

    fetch("/get/" + state.currentBubble.name)
      .then(response => response.json())
      .then(data => {
        actions.addBubbleThreads(data)
      });
  },
  updateThreadData: threadData => (state, actions) => {
    console.log(threadData);
    let bubble = state.bubbles.find(bubble => bubble.name === threadData.bubbleName);
    if (bubble) {
      let thread = bubble.threads.find(thread => thread._id === threadData.threadId);
      if (thread) {

        if (threadData.userCount) {
          thread.userCount = threadData.userCount;
        }

        if (threadData.score) {
          thread.score = threadData.score;
        }
        
      }
    }
    return true;
  }
}
