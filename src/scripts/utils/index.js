
export const timeSince = (date) => {

  let seconds = Math.floor((new Date() - date) / 1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval >= 1) {
    return interval + " years ago";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval + " months ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval + " days ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval + " hours ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval + " minutes ago";
  }

  if (seconds > 1) {
    return Math.floor(seconds) + " seconds ago";
  } else {
    return "now";
  }

}





export const isElementInViewport = (el) => {
  let rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
  );
}


export const ObjectId = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
    s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))



export const getStateFromStorage = () => JSON.parse(window.localStorage.getItem('bubbleio'))

export const storeStateInStorage = (state) => window.localStorage.setItem('bubbleio', JSON.stringify(state))



export const shortenText = (s, n) => {
    var cut= s.indexOf(' ', n);
    if(cut== -1) return s;
    return s.substring(0, cut)
}

export const mergeStates = (stateA, stateB) => {

  // Merge the threads array before merging the bubbles
  if (stateB.bubbles) {
    for (var i = 0; i < stateB.bubbles.length; i++) { // For each new bubble
      let matchFound = false;
      for (var j = 0; j < stateA.bubbles.length; j++) { // find match
        if (stateB.bubbles[i]._id == stateA.bubbles[j]._id) {
          matchFound = true;
          stateA.bubbles[j] = mergeBubbles(stateA.bubbles[j], stateB.bubbles[i]);
        }
      }
      if (!matchFound) {
        stateA.bubbles.push(stateB.bubbles[i]);
      }
    }
  }


  stateB.bubbles = stateA.bubbles; // TODO: Optimize this (currently the array gets passed around 3 times, should be 1 time only)

  // Merge the state
  let newState = Object.assign({}, stateA, stateB);
  storeStateInStorage(newState);
  return newState;
}










const mergeBubbles = (bubbleA, bubbleB) => {

  // Merge the threads array before merging the bubbles
  if (bubbleB.threads) {
    for (var i = 0; i < bubbleB.threads.length; i++) { // For each new bubble
      let matchFound = false;
      for (var j = 0; j < bubbleA.threads.length; j++) { // find match
        if (bubbleB.threads[i]._id == bubbleA.threads[j]._id) {
          matchFound = true;
          bubbleA.threads[j] = mergeThreads(bubbleA.threads[j], bubbleB.threads[i]);
        }
      }
      if (!matchFound) {
        bubbleA.threads.unshift(bubbleB.threads[i]);
      }
    }
  }

  // Sort the threads
  if (bubbleA.threads) {
    bubbleA.threads = sortByRelevance(bubbleA.threads);
  }

  bubbleB.threads = bubbleA.threads; // TODO: Optimize this (currently the array gets passed around 3 times, should be 1 time only)

  // Merge the state
  return Object.assign({}, bubbleA, bubbleB);
}










const mergeThreads = (threadA, threadB) => {

  // Merge the messages array before merging the threads
  if (threadB.messages) {
    for (var i = 0; i < threadB.messages.length; i++) { // For each new bubble
      let matchFound = false;
      for (var j = 0; j < threadA.messages.length; j++) { // find match
        if (threadB.messages[i]._id == threadA.messages[j]._id) {
          matchFound = true;
          threadA.messages[j] = Object.assign(threadA.messages[j], threadB.messages[i]); // Basic shallow merge
        }
      }
      if (!matchFound) {
        threadA.messages.push(threadB.messages[i]);
      }
    }
  }


  // Sort the messages
  if (threadA.messages) {
    threadA.messages.sort(compareAge);
  }

  threadB.messages = threadA.messages; // TODO: Optimize this (currently the array gets passed around 3 times, should be 1 time only)

  // Merge the state
  return Object.assign({}, threadA, threadB);
}







const sortByRelevance = (threads) => {

  // Score = (P-1) / (T+2)^G
  //
  // where,
  // P = points of an item (and -1 is to negate submitters vote)
  // T = time since submission (in hours)
  // G = Gravity, defaults to 1.8

  let now = new Date();

  // Calculate relevance for each thread
  for (var i = 0; i < threads.length; i++) {
    threads[i].relevance = threads[i].score / Math.pow((((now - threads[i].created) / 3600000) + 2), 1.8);
  }

  // Sort threads by "relevance"
  return threads.sort(compareRelevance);
}


const compareRelevance = (a, b) => {
  if (a.relevance < b.relevance) {
    return 1;
  }
  if (a.relevance > b.relevance) {
    return -1;
  }
  return 0;
}


const compareAge = (a, b) => {
  if (a.created < b.created) {
    return -1;
  }
  if (a.created > b.created) {
    return 1;
  }
  return 0;
}
