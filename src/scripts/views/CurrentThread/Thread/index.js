import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"
import {timeSince, isElementInViewport, shortenText, getYoutubeId} from '../../../utils/'


export const Thread = (thread, index, currentBubble, actions) => {

  let contentBlock;
  if (thread.type == "default") {
    contentBlock = null
  } else if (thread.type == "text") {
    contentBlock = <div class="text">{thread.text}</div>;
  } else if (thread.type == "link") {
    if (thread.url.match('^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$')) { // If is youtube
      thread.src = "https://img.youtube.com/vi/"+getYoutubeId(thread.url)+"/hqdefault.jpg";
    }
    contentBlock = <a href={thread.url} target="_blank" class="link">{thread.url}</a>
  } else if (thread.type == "image") {
    contentBlock = <div class="img"><img src={thread.src} alt={thread.title} /></div>
  }

  if (!thread.src) {
    thread.src = "/img/thread_types/large/" + thread.type + ".svg";
  }





  return (
    <li key={thread._id} class="thread" data-type={thread.type} data-upvoted={thread.upvoted} oncreate={el => {
      el.classList.add("slidein");
      setTimeout(() => {
        el.classList.remove("slidein");
      }, index * 50);
    }}>
      <div class="header">
        <div class="thread-view-header">
          <div class="back" onclick={ev => {
            actions.location.go("/" + currentBubble.name);
          }}></div>
          <h2>{thread.title}</h2>
        </div>
        <p>{"by " + thread.author + " on " + currentBubble.name + " " + timeSince(thread.created)}</p>
      </div>
      {contentBlock}
      {threadFooter(thread, actions)}
    </li>
  )
}















const threadFooter = (thread, actions) => (
  h("div", { class: "footer" }, [
    h("div", { class: "users", userCount: thread.userCount, onupdate: (el, oldProps) => {
      if (oldProps.userCount < thread.userCount) {
        el.classList.add("countUp");
        setTimeout(() => {
          el.classList.remove("countUp");
        }, 25);
      } } }, [
        h("div", { class: "count" }, [
          h("span", {}, thread.userCount)
        ])
      ]),
    h("div", { class: "replies", messageCount: thread.messages.length, onupdate: (el, oldProps) => {
      if (oldProps.messageCount < thread.messages.length) {
        el.classList.add("countUp");
        setTimeout(() => {
          el.classList.remove("countUp");
        }, 25);
      } } }, [
        h("div", { class: "count" }, [
          h("span", {}, thread.messages.length)
        ])
      ]),
    h("button", { class: "upvote", score: thread.score, onclick: (ev) => {
      ev.stopPropagation();
      actions.upvote(thread);
    }, onupdate: (el, oldProps) => {
      if (oldProps.score < thread.score) {
        el.classList.add("countUp");
        setTimeout(() => {
          el.classList.remove("countUp");
        }, 25);
      }
    } }, thread.score)
  ])
)
