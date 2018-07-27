


export const isElementInViewport = (el) => {
  let rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}



export const dontMerge = (destination, source) => source;

export const ObjectId = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) => s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))

export const getStateFromStorage = () => JSON.parse(window.localStorage.getItem('bubbleio'))

export const storeStateInStorage = (state) => {
  window.localStorage.setItem('bubbleio', JSON.stringify(state));
  return state;
}



export const timeSince = (date) => {

  let seconds = Math.floor((new Date() - new Date(date)) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval + " years ago";
  }

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval + " months ago";
  }

  interval = Math.floor(seconds / 86400);
  if (interval == 1) {
    return "yesterday";
  }

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
  }
  
  return "now";
}




export const shortenText = (s, n) => {
  if (s.length > n+3) {
    let cut = s.indexOf(' ', n);
    if(cut == -1) return s;
    return s.substring(0, cut) + "..."
  } else {
    return s;
  }
}

export const shortenString = (s, n) => {
  if (s.length > n+3) {
    return s.substring(0, n) + "...";
  } else {
    return s;
  }
}






export const getYoutubeId = url => {
  let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  let match = url.match(regExp);
  return (match&&match[7].length==11)? match[7] : false;
}



export const getVimeoId = url => {
  let m = url.match(/^.+vimeo.com\/(.*\/)?([^#\?]*)/);
  return m ? m[2] || m[1] : null;
}







// const getSortedThreadsArray = threads => {

//   // Calculate relevance score for each threads
//   for (var i = 0; i < threads.length; i++) {
    
//     // Score = (P-1) / (T+2)^G
//     //
//     // where,
//     // P = points of an item (and -1 is to negate submitters vote)
//     // T = time since submission (in hours)
//     // G = Gravity, defaults to 1.8

//     // Todo: query message count
//     if (!threads[i].messages) {
//       threads[i].messages = [];
//     }

//     threads[i].relevance = (threads[i].score + (threads[i].messages.length/2) + 1) / Math.pow(((new Date() - threads[i].created) / 3600000), 1.8);
//   }

//   // Sort by relevance
//   threads.sort(compareRelevance);

//   // Build id array
//   let sortedThreads = [];
//   for (var i = 0; i < threads.length; i++) {
//     sortedThreads.push(threads[i]._id);
//   }

//   return sortedThreads;
// }





