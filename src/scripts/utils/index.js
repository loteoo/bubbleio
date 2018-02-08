
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




// TODO: Dont use deepmerge anymore, custom merging function with custom array merges:
// One for bubbles(alphabetical), threads(score) and messages(created)








export const mergeStates = (stateA, stateB) => {

  // Merge the threads array before merging the bubbles
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


  stateB.bubbles = stateA.bubbles; // TODO: Optimize this (currently the array gets passed around 3 times, should be 1 time only)

  // Merge the state
  return Object.assign(stateA, stateB);
}










export const mergeBubbles = (bubbleA, bubbleB) => {
  // Merge the threads array before merging the bubbles
  for (var i = 0; i < bubbleB.threads.length; i++) { // For each new bubble
    let matchFound = false;
    for (var j = 0; j < bubbleA.threads.length; j++) { // find match
      if (bubbleB.threads[i]._id == bubbleA.threads[j]._id) {
        matchFound = true;
        bubbleA.threads[j] = mergeThreads(bubbleA.threads[j], bubbleB.threads[i]);
      }
    }
    if (!matchFound) {
      bubbleA.threads.push(bubbleB.threads[i]);
    }
  }

  // Sort the threads
  bubbleA.threads = sortByRelevance(bubbleA.threads);

  bubbleB.threads = bubbleA.threads; // TODO: Optimize this (currently the array gets passed around 3 times, should be 1 time only)

  // Merge the state
  return Object.assign(bubbleA, bubbleB);
}










export const mergeThreads = (threadA, threadB) => {

  // Merge the messages array before merging the threads
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

  threadB.messages = threadA.messages; // TODO: Optimize this (currently the array gets passed around 3 times, should be 1 time only)

  // Merge the state
  return Object.assign(threadA, threadB);
}







const sortByRelevance = (threads) => {

  // Score = (P-1) / (T+2)^G
  //
  // where,
  // P = points of an item (and -1 is to negate submitters vote)
  // T = time since submission (in hours)
  // G = Gravity, defaults to 1.8

  let now = new Date();

  for (thread of threads) {

    // Calculate thread relevance
    thread.relevance = thread.score / Math.pow((((now - thread.created) / 3600000) + 2), 1.8);
  }

  // Sort threads by "relevance"
  return threads.sort(compareScore);

}


const compareScore = (a, b) => {

  if (a.relevance < b.relevance) {
    return 1;
  }
  if (a.relevance > b.relevance) {
    return -1;
  }
  // a must be equal to b
  return 0;
}
