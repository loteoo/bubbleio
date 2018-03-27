import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"
import {timeSince, shortenText} from '../../../utils/'


export const ThreadItem = ({thread, index, currentBubble, currentThread}) => (state, actions) =>
  <li key={thread._id} class="thread" index={index} type={thread.type} upvoted={thread.upvoted} current={(thread._id == Object.assign({'_id': ""}, currentThread)._id).toString()} hasthumbnail={(typeof thread.thumbnail !== 'undefined').toString()} onclick={ev => {
      actions.location.go("/" + currentBubble.name + "/" + thread._id);
    }} oncreate={el => {
      el.style.transform = "translateX(-100%)";
      el.style.opacity = "0";
      setTimeout(() => {
        el.removeAttribute("style");
      }, index * 40 + 40);
    }} onupdate={(el, oldProps) => {
      if (index != oldProps.index) { // If order in list changed
        el.style.transitionDuration = "0ms";
        el.style.zIndex = "1";
        el.style.transform = "translateY(calc("+(oldProps.index - index)*100+"% + "+(oldProps.index - index)+"em))";
        void el.offsetWidth; // This forces element render
        el.removeAttribute("style");
      }
    }}>
    <ThreadInner thread={thread} currentBubble={currentBubble} />
  </li>






export const ThreadInner = ({thread, currentBubble}) => (state, actions) => {
  if (state.user.layoutMode == "preview") {
    return (
      <div class="inner">
        <ThreadHeader thread={thread} currentBubble={currentBubble} />
        <ThreadPreview thread={thread} currentBubble={currentBubble} />
        <ThreadFooter thread={thread} />
      </div>
    )
  } else { // Compact mode
    return (
      <div class="inner">
        <div class="thumbnail" Style={"background-image: url('"+thread.thumbnail+"')"}></div>
        <div class="info">
          <ThreadHeader thread={thread} currentBubble={currentBubble} />
          <ThreadFooter thread={thread} />
        </div>
      </div>
    )
  }
}


const ThreadHeader = ({thread, currentBubble}) =>
  <div class="header">
    <h2>{thread.title}</h2>
    <p>{"by " + thread.author + " on " + currentBubble.name + " " + timeSince(thread.created)}</p>
  </div>



const ThreadPreview = ({thread, currentBubble}) => {
  if (thread.type == "default") {
    return
  } else if (thread.type == "text") {
    return <TextThreadPreview thread={thread} />
  } else if (thread.type == "link") {
    return <LinkThreadPreview thread={thread} />
  } else if (thread.type == "youtube") {
    return <YoutubeThreadPreview thread={thread} />
  } else if (thread.type == "vimeo") {
    return <VimeoThreadPreview thread={thread} />
  } else if (thread.type == "image") {
    return <ImageThreadPreview thread={thread} />
  }
}





const TextThreadPreview = ({thread}) =>
  <div class="text">
    {shortenText(thread.text, 250)}
  </div>

const LinkThreadPreview = ({thread}) =>
  <div class="link">
    <a href={thread.url} target="_blank">
      {shortenText(thread.url, 32)}
    </a>
  </div>

const ImageThreadPreview = ({thread}) =>
<div class="sixteen-by-nine">
  <div class="img frame">
    <img src={thread.src} alt={thread.title} />
  </div>
</div>

const YoutubeThreadPreview = ({thread}) =>
<div class="sixteen-by-nine">
  <div class="linkPreview youtube frame">
    <img src={thread.thumbnail} alt={thread.title} />
  </div>
</div>

const VimeoThreadPreview = ({thread}) =>
<div class="sixteen-by-nine">
  <div class="linkPreview vimeo frame">
    <img src={thread.thumbnail} alt={thread.title} />
  </div>
</div>


export const ThreadFooter = ({thread}) => (state, actions) => (
  <div class="footer">
    <div class="users">
      <div class="count" userCount={thread.userCount} onupdate={(el, oldProps) => {
        if (oldProps.userCount < thread.userCount) {
          el.classList.add("countUp");
          void el.offsetWidth; // This forces element render
          el.classList.remove("countUp");
        }
      }}>
        <span>{thread.userCount}</span>
      </div>
    </div>
    <div class="replies">
      <div class="count" messageCount={thread.messages.length} onupdate={(el, oldProps) => {
        if (oldProps.messageCount < thread.messages.length) {
          el.classList.add("countUp");
          void el.offsetWidth; // This forces element render
          el.classList.remove("countUp");
        }
      }}>
        <span>{thread.messages.length}</span>
      </div>
    </div>
    <div class="score" score={thread.score} onupdate={(el, oldProps) => {
      if (oldProps.score < thread.score) {
        el.classList.add("countUp");
        void el.offsetWidth; // This forces element render
        el.classList.remove("countUp");
      } else if (oldProps.score > thread.score) {
        el.classList.add("countDown");
        void el.offsetWidth; // This forces element render
        el.classList.remove("countDown");
      }
    }}>
      <button class="downvote" onclick={ev => {
        ev.stopPropagation();

        if (thread.upvoted > -5) {

          // Increase score and local upvoted count
          thread.score--;
          thread.upvoted--;

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
          socket.emit('update thread', thread);

          // Start cooldown animation
          ev.target.style.pointerEvents = "none";
          setTimeout(() => {
            ev.target.style.pointerEvents = "all";
          }, 2000);
        }
      }}>
      </button>
      <div class="count">
        <span>{thread.score}</span>
      </div>
      <button class="upvote" onclick={ev => {
        ev.stopPropagation();

        if (thread.upvoted < 5) {
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
          socket.emit('update thread', thread);

          // Start cooldown animation
          ev.target.style.pointerEvents = "none";
          setTimeout(() => {
            ev.target.style.pointerEvents = "all";
          }, 1000);
        }
      }}>
      </button>
    </div>
  </div>
)
