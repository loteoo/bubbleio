export const timeSince = (date) => {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

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


// Can accept as mush arrays as you want as arguments,
// Props from arrays on the right take priority over the ones on the left
const mergeObjectProps = (target) => {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            if (Array.isArray(prop)) {
            } else {
              target[prop] = source[prop];
            }
        }
    });
    return target;
}



export const mergeUniqueId = (a, b) => {


  // Merge objects that have the same id
  // by updating the props of the old one with the ones of the new
  for (var i = 0; i < a.length; i++) {
    for (var j = 0; j < b.length; j++) {
      if (a[i]["_id"] == b[j]["_id"]) {
        a[i] = mergeObjectProps(a[i], b[j]);
      }
    }
  }


  // Create an array of the objects that are new, (not present in the first array)
  var reduced = b.filter( bitem => ! a.find ( aitem => bitem["_id"] === aitem["_id"]) );


  // Merge and return
  return a.concat(reduced);
}




export const isElementInViewport = (el) => {
  var rect = el.getBoundingClientRect();
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
