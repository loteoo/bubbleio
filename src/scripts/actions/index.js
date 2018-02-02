import {location} from "@hyperapp/router"
import {ObjectId, storeStateInStorage} from '../utils/'
import {deepmerge} from '../utils/deepmerge.js'

export const actions = {
  location: location.actions,
  setGravity: gravity => ({gravity: gravity}),
  login: ev => state => {
    ev.preventDefault();
    return { username: ev.target[0].value }
  },
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
  keyboardSubmit: ev => state => {
    if (ev.target[0].value) {

      let timestamp = new Date().getTime();

      if (state.currentView == "bubbleView") {


        // Create the thread object
        let thread = {
          _id: ObjectId(),
          title: ev.target[0].value,
          score: 1,
          created: timestamp,
          type: "message",
          author: state.username
        }


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
            message: ev.target[0].value,
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
    state.bubbles = deepmerge(state.bubbles, bubblesData)
    return true;
  },
  updateBubbleUserCounts: userCounts => (state, actions) => {
    Object.keys(userCounts).forEach(function(bubbleName) {
      let bubble = state.bubbles.find(bubble => bubble.name === bubbleName);
      if (bubble) {
        bubble.userCount = userCounts[bubbleName];
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
      bubble.threads = deepmerge(bubble.threads, threadsData.threads)
    }
    return true;
  },
  loadMoreThreads: () => (state, actions) => {
    console.log("load more in "+state.currentBubble.name+" !");

    fetch("/get/" + state.currentBubble.name)
      .then(response => response.json())
      .then(data => {

        actions.addBubbleThreads(data);


        storeStateInStorage(state);

      });

  },
  updateThreadData: threadData => (state, actions) => {
    let bubble = state.bubbles.find(bubble => bubble.name === threadData.bubbleName);
    if (bubble) {
      let thread = bubble.threads.find(thread => thread._id === threadData.threadId);
      if (thread) {

        if (typeof threadData.userCount !== 'undefined') {
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
