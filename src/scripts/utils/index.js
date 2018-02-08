import {deepmerge} from '../utils/deepmerge.js'

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

export const mergeUniqueId = (a, b, options) =>  {

  console.log("merging");
  // Merge objects that have the same id
  // by updating the props of the old one with the ones of the new

  // TODO: use Array.map/filter/reduce instead
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      if (a[i]["_id"] == b[j]["_id"]) {
        a[i] = deepmerge(a[i], b[j], options);
      }
    }
  }


  // Create an array of the objects that are new, (not present in the first array)
  let reduced = b.filter( bitem => ! a.find ( aitem => bitem["_id"] === aitem["_id"]) );


  // Merge updated array and new items array
  return a.concat(reduced).sort(compareScore);
}



// Score = (P-1) / (T+2)^G
//
// where,
// P = points of an item (and -1 is to negate submitters vote)
// T = time since submission (in hours)
// G = Gravity, defaults to 1.8 in news.arc
function compareScore(a, b) {
  let now = new Date();
  a.order = a.score / Math.pow((Math.floor((now - a.created) / 3600000) + 2), 1.8);
  b.order = b.score / Math.pow((Math.floor((now - b.created) / 3600000) + 2), 1.8);

  if (a.order < b.order) {
    return 1;
  }
  if (a.order > b.order) {
    return -1;
  }
  // a must be equal to b
  return 0;
}
