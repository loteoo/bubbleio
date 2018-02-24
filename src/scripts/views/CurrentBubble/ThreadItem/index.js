import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"
import {timeSince, isElementInViewport, shortenText, getYoutubeId} from '../../../utils/'


export const ThreadItem = (thread, index, currentBubble, currentThread, actions) => {

  let threadTitle = <h2>{shortenText(thread.title, 32)}</h2>;
  let contentBlock;
  if (thread.type == "default") {
    contentBlock = null
  } else if (thread.type == "text") {
    contentBlock = <div class="text">{shortenText(thread.text, 250)}</div>;
  } else if (thread.type == "link") {
    if (thread.url.match('^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$')) { // If is youtube
      thread.src = "https://img.youtube.com/vi/"+getYoutubeId(thread.url)+"/hqdefault.jpg";
    }
    threadTitle = <h2><a href={thread.url} target="_blank">{shortenText(thread.title, 32)}</a></h2>
    contentBlock = <a href={thread.url} target="_blank" class="link">{thread.url}</a>
  } else if (thread.type == "image") {
    contentBlock = <div class="img"><img src={thread.src} alt={thread.title} /></div>
  }

  if (!thread.src) {
    thread.src = "/img/thread_types/" + thread.type + ".svg";
  }

  let currentClass = "";
  if (thread._id == currentThread._id) {
    currentClass = " current";
  }



  if (window.innerWidth >= 768) { // If desktop
    return (
      <li key={thread._id} class={"thread desktop" + currentClass} index={index} data-type={thread.type} data-upvoted={thread.upvoted} onclick={ev => {
        actions.location.go("/" + currentBubble.name + "/" + thread._id);
      }} oncreate={el => {
        el.classList.add("slidein");
        setTimeout(() => {
          el.classList.remove("slidein");
        }, index * 50 + 50);
      }} onupdate={(el, oldProps) => {
        if (index != oldProps.index) { // If order in list changed
          el.style.transitionDuration = "0ms";
          el.style.zIndex = "1";
          el.style.transform = "translateY(calc("+(oldProps.index - index)*100+"% + "+(oldProps.index - index)+"em))";
          setTimeout(() => {
            el.style.transitionDuration = "200ms";
            el.style.zIndex = "0";
            el.style.transform = "translateY(0%)";
          }, 250);
        }
      }}>
        <div class="thumbnail" Style={"background-image: url('"+thread.src+"')"}></div>
        <div class="content">
          {threadTitle}
          <div class="info">
            <p>{"by " + thread.author + " on " + currentBubble.name + " " + timeSince(thread.created)}</p>
            {threadFooter(thread, actions)}
          </div>
        </div>
      </li>
    )
  } else { // if mobile
    return (
      <li key={thread._id} class={"thread" + currentClass} index={index} data-type={thread.type} data-upvoted={thread.upvoted} onclick={() => {
          actions.location.go("/" + currentBubble.name + "/" + thread._id);
        }} oncreate={el => {
          el.classList.add("slidein");
          setTimeout(() => {
            el.classList.remove("slidein");
          }, index * 50);
        }} onupdate={(el, oldProps) => {
          if (index != oldProps.index) { // If order in list changed
            el.style.transitionDuration = "0ms";
            el.style.zIndex = "1";
            el.style.transform = "translateY(calc("+(oldProps.index - index)*100+"% + "+(oldProps.index - index)+"em))";
            setTimeout(() => {
              el.style.transitionDuration = "200ms";
              el.style.zIndex = "0";
              el.style.transform = "translateY(0%)";
            }, 250);
          }
        }}>
        <div class="header">
          <h4>{thread.title}</h4>
          <p>{"by " + thread.author + " on " + currentBubble.name + " " + timeSince(thread.created)}</p>
        </div>
        {contentBlock}
        {threadFooter(thread, actions)}
      </li>
    )
  }
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
