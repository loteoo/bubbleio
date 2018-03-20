import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"
import {timeSince, shortenText, getYoutubeId} from '../../../utils/'


export const ThreadItem = (thread, index, currentBubble, currentThread) => (state, actions) =>
    <li key={thread._id} class="thread" index={index} type={thread.type} upvoted={thread.upvoted} opened={(thread._id == currentThread._id).toString()} onclick={ev => {
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
      <ThreadInner thread={thread} currentBubble={currentBubble} />
    </li>






const ThreadInner = ({thread, currentBubble}) => {
  if (window.innerWidth >= 768) { // If desktop
    return (
      <div class="desktop">
        <div class="thumbnail" Style={"background-image: url('"+thread.src+"')"}></div>
        <div class="info">
          <ThreadHeader thread={thread} currentBubble={currentBubble} />
          <ThreadFooter thread={thread} />
        </div>
      </div>
    )
  } else { // if mobile
    return (
      <div class="mobile">
        <ThreadHeader thread={thread} currentBubble={currentBubble} />
        <ThreadContent thread={thread} currentBubble={currentBubble} />
        <ThreadFooter thread={thread} />
      </div>
    )
  }
}


const ThreadHeader = ({thread, currentBubble}) =>
  <div class="header">
    <h2>{shortenText(thread.title, 32)}</h2>
    <p>{"by " + thread.author + " on " + currentBubble.name + " " + timeSince(thread.created)}</p>
  </div>



const ThreadContent = ({thread, currentBubble}) => {
  if (thread.type == "default") {
    return
  } else if (thread.type == "text") {
    return <div class="text">{shortenText(thread.text, 250)}</div>;
  } else if (thread.type == "link") {
    if (thread.url.match(/^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/)) { // If is youtube
      thread.src = "https://img.youtube.com/vi/"+getYoutubeId(thread.url)+"/hqdefault.jpg";
    } else if (thread.url.match(/^(http\:\/\/|https\:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)$/)) {
      // this is a vimeo link
    }
    return <a href={thread.url} target="_blank" class="link">{thread.url}</a>
  } else if (thread.type == "image") {
    return <div class="img"><img src={thread.src} alt={thread.title} /></div>
  }
}






const ThreadFooter = ({thread}) => (state, actions) => (
  <div class="footer">
    <div class="users" userCount={thread.userCount} onupdate={(el, oldProps) => {
      if (oldProps.userCount < thread.userCount) {
        el.classList.add("countUp");
        setTimeout(() => {
          el.classList.remove("countUp");
        }, 25);
      }
    }}>
      <div class="count">
        <span>{thread.userCount}</span>
      </div>
    </div>
    <div class="replies" messageCount={thread.messages.length} onupdate={(el, oldProps) => {
      if (oldProps.messageCount < thread.messages.length) {
        el.classList.add("countUp");
        setTimeout(() => {
          el.classList.remove("countUp");
        }, 25);
      }
    }}>
      <div class="count">
        <span>{thread.messages.length}</span>
      </div>
    </div>
    <button class="upvote" score={thread.score} onclick={ev => {
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

    }} onupdate={(el, oldProps) => {
      if (oldProps.score < thread.score) {
        el.classList.add("countUp");
        setTimeout(() => {
          el.classList.remove("countUp");
        }, 25);
      }
    }}>
      <div class="count">
        <span>{thread.score}</span>
      </div>
    </button>
  </div>
)
