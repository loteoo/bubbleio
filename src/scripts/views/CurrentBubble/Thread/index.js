import {h} from 'hyperapp'
import {timeSince, isElementInViewport, shortenText} from '../../../utils/'


export const Thread = (thread, currentBubble, actions, display = "summary") => {
  if (!thread.userCount) {
    thread.userCount = 0;
  }
  if (!thread.messages) {
    thread.messages = [];
  }
  if (!thread.order) {
    thread.order = 0;
  }
  if (!thread.upvoted) {
    thread.upvoted = "";
  }
  // console.log(thread.order);

  if (display == "summary") {
    if (window.innerWidth >= 768) {
      display = "desktop";
    }
  }

  let contentBlock;
  if (thread.type == "default") {
    contentBlock = null
  } else if (thread.type == "text") {

    if (display == "summary") {
      contentBlock = h("div", { class: "text" }, shortenText(thread.text, 250) + "...");
    } else {
      contentBlock = h("div", { class: "text" }, thread.text);
    }
  } else if (thread.type == "link") {
    contentBlock = h("a", { class: "link", href: thread.url, target: "_blank" }, thread.url)
  } else if (thread.type == "image") {
    contentBlock = h("div", { class: "img" }, [
      h("img", { src: thread.src, alt: thread.title })
    ])
  } else if (thread.type == "youtube") {
    contentBlock = h("div", { class: "thumbnail", style: "background-image: url('"+thread.youtubeId+"')" })
  }

  if (!thread.src) {
    thread.src = "/img/thread_types/" + thread.type + ".svg";
  }

  if (display == "summary") {
    return h("li", { key: thread._id, class: "thread", "data-type": thread.type, "data-upvoted": thread.upvoted, "data-display": display, onclick: () => {
      actions.location.go("/" + currentBubble.name + "/" + thread._id);
    } }, [
      h("div", { class: "header" }, [
        h("h4", {}, thread.title),
        h("p", {}, "by " + thread.author + " on " + currentBubble.name + " " + timeSince(thread.created))
      ]),
      contentBlock,
      threadFooter(thread, actions)
    ])
  } else if (display == "full") {
    return h("li", { key: thread._id, class: "thread ", "data-type": thread.type, "data-upvoted": thread.upvoted, "data-display": display }, [
      h("div", { class: "header" }, [
        h("div", { class: "thread-view-header" }, [
          h("div", { class: "back", onclick: () => {
            actions.location.go("/" + currentBubble.name);
          }}),
          h("h2", {}, thread.title)
        ]),
        h("p", {}, "by " + thread.author + " on " + currentBubble.name + " " + timeSince(thread.created))
      ]),
      contentBlock,
      threadFooter(thread, actions)
    ])
  } else if (display == "desktop") {
    return h("li", { key: thread._id, class: "thread ", "data-type": thread.type, "data-upvoted": thread.upvoted, "data-display": display, onclick: () => {
      actions.location.go("/" + currentBubble.name + "/" + thread._id);
    } }, [
      h("div", { class: "thumbnail", Style: "background-image: url('"+thread.src+"')" }),
      h("div", { class: "content" }, [
        h("h2", {}, thread.title),
        h("div", { class: "info" }, [
          h("p", {}, "by " + thread.author + " on " + currentBubble.name + " " + timeSince(thread.created)),
          threadFooter(thread, actions)
        ])
      ])
    ])
  }
}















const threadFooter = (thread, actions) => (
  h("div", { class: "footer" }, [
    h("div", { class: "users", userCount: thread.userCount, onupdate: (element, oldProps) => {
      if (oldProps.userCount < thread.userCount) {
        element.classList.add("countUp");
        setTimeout(() => {
          element.classList.remove("countUp");
        }, 25);
      } } }, [
        h("div", { class: "count" }, [
          h("span", {}, thread.userCount)
        ])
      ]),
    h("div", { class: "replies", messageCount: thread.messages.length, onupdate: (element, oldProps) => {
      if (oldProps.messageCount < thread.messages.length) {
        element.classList.add("countUp");
        setTimeout(() => {
          element.classList.remove("countUp");
        }, 25);
      } } }, [
        h("div", { class: "count" }, [
          h("span", {}, thread.messages.length)
        ])
      ]),
    h("button", { class: "upvote", score: thread.score, onclick: (ev) => {
      ev.stopPropagation();
      actions.upvote(thread);
    }, onupdate: (element, oldProps) => {
      if (oldProps.score < thread.score) {
        element.classList.add("countUp");
        setTimeout(() => {
          element.classList.remove("countUp");
        }, 25);
      }
    } }, thread.score)
  ])
)
