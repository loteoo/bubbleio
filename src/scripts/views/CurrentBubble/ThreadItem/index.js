import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"
import {timeSince, shortenText, getYoutubeId} from '../../../utils/'


export const ThreadItem = (thread, index, currentBubble, currentThread, actions) => {

  let threadTitle = <h2>{shortenText(thread.title, 32)}</h2>;
  let contentBlock;
  if (thread.type == "default") {
    contentBlock = null
  } else if (thread.type == "text") {
    contentBlock = <div class="text">{shortenText(thread.text, 250)}</div>;
  } else if (thread.type == "link") {
    if (thread.url.match(/^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/)) { // If is youtube
      thread.src = "https://img.youtube.com/vi/"+getYoutubeId(thread.url)+"/hqdefault.jpg";
    } else if (thread.url.match(/^(http\:\/\/|https\:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)$/)) {
      // this is a vimeo link
    }
    threadTitle = <h2><a href={thread.url} target="_blank">{shortenText(thread.title, 32)}</a></h2>
    contentBlock = <a href={thread.url} target="_blank" class="link">{thread.url}</a>
  } else if (thread.type == "image") {
    contentBlock = <div class="img"><img src={thread.src} alt={thread.title} /></div>
  }



  let extraClass = "";
  if (currentThread) { // If there is thread opened in the app
    if (thread._id == currentThread._id) { // If this is the one that is opened
      extraClass += " current";
    }
  }


  if (!thread.src) {
    extraClass += " noimage";
  }


  if (window.innerWidth >= 768) { // If desktop
    return (
      <li key={thread._id} class={"thread desktop" + extraClass} index={index} data-type={thread.type} data-upvoted={thread.upvoted} onclick={ev => {
        actions.location.go("/" + currentBubble.name + "/" + thread._id);
      }} oncreate={el => {
        el.style.transform = "translateX(-100%)";
        el.style.opacity = "0";
        setTimeout(() => {
          el.removeAttribute("style");
        }, index * 50 + 50);
      }} onupdate={(el, oldProps) => {
        if (index != oldProps.index) { // If order in list changed
          el.style.transitionDuration = "0ms";
          el.style.zIndex = "1";
          el.style.transform = "translateY(calc("+(oldProps.index - index)*100+"% + "+(oldProps.index - index)+"em))";
          setTimeout(() => {
            el.removeAttribute("style");
          }, 50);
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
      <li key={thread._id} class={"thread" + extraClass} index={index} data-type={thread.type} data-upvoted={thread.upvoted} onclick={() => {
          actions.location.go("/" + currentBubble.name + "/" + thread._id);
        }} oncreate={el => {
          el.style.transform = "translateX(-100%)";
          el.style.opacity = "0";
          setTimeout(() => {
            el.removeAttribute("style");
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
    h("button", { class: "upvote", score: thread.score, onclick: ev => {
      ev.stopPropagation();

      // Increase score and local upvoted count
      thread.score++;
      thread.upvoted++;

      // Update immediately on this client
      actions.updateState({
        bubbles: [
          {
            _id: thread.bubble_id,
            threads: [
              thread
            ]
          }
        ]
      });

      // Send to server
      socket.emit('thread upvote', thread);

    }, onupdate: (el, oldProps) => {
      if (oldProps.score < thread.score) {
        el.classList.add("countUp");
        setTimeout(() => {
          el.classList.remove("countUp");
        }, 25);
      }
    } }, [
      h("div", { class: "count" }, [
        h("span", {}, thread.score)
      ])
    ])
  ])
)
