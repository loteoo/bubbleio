import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"
import {timeSince, shortenText, getYoutubeId, panelDrag} from '../../../utils/'
import {ThreadFooter} from '../../CurrentBubble/ThreadItem/'


export const Thread = ({currentThread, currentBubble}) => (state, actions) =>
  <article key={currentThread._id} class="thread" type={currentThread.type} upvoted={currentThread.upvoted}>
    <div class="thread-header">
      <div class="back" onclick={ev => {
        actions.location.go("/" + currentBubble.name);
      }}></div>
    <ThreadFullHeader thread={currentThread} currentBubble={currentBubble} />
      <div class="options">
        <button onclick={ev => {
            if (ev.target.nextSibling.classList.contains("opened")) {
              ev.target.nextSibling.classList.remove("opened")
            } else {
              ev.target.nextSibling.classList.add("opened")
            }
          }}>
        </button>
        <ThreadOptions currentThread={currentThread} />
      </div>
    </div>
    <div class="panelScroll">
      <div class="panel" onmousedown={panelDrag.onmousedown} onmousemove={panelDrag.onmousemove} onmouseup={panelDrag.onmouseup} onmouseout={panelDrag.onmouseup}>
        <div class="content">
          <ThreadFullContent thread={currentThread} currentBubble={currentBubble} />
        </div>
        <ThreadFooter thread={currentThread} />
      </div>
    </div>
  </article>



export const ThreadOptions = ({currentThread}) => (state, actions) => {
  if (currentThread.author == state.user.username) { // If user owns this thread
    return (
      <ul>
        <li onclick={ev => {
          actions.deleteThread(currentThread)
          socket.emit('archive thread', currentThread)
        }}><span>Delete</span></li>
      </ul>
    )
  } else {
    return (
      <ul>
        <li onclick={ev => {
          console.log("Saving comming soon...");
        }}><span>Save</span></li>
        <li onclick={ev => {
            console.log("Downvote comming soon...");
        }}><span>Downvote</span></li>
      </ul>
    )
  }
}


export const ThreadFullHeader = ({thread, currentBubble}) =>
  <div class="header">
    <h2>{thread.title}</h2>
    <p>{"by " + thread.author + " on " + currentBubble.name + " " + timeSince(thread.created)}</p>
  </div>

export const ThreadFullContent = ({thread, currentBubble}) => {
  if (thread.type == "default") {
    return
  } else if (thread.type == "text") {
    return <div class="text">{thread.text}</div>;
  } else if (thread.type == "link") {
    if (thread.url.match(/^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/)) { // If is youtube
      return (
        <a href={thread.url} target="_blank" class="linkPreview youtubePreview">
          <img src={thread.thumbnail} alt={thread.title} />
        </a>
      )
    } else if (thread.url.match(/^(http\:\/\/|https\:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)$/)) {
      return (
        <a href={thread.url} target="_blank" class="linkPreview vimeoPreview">
          <img src={thread.thumbnail} alt={thread.title} />
        </a>
      )
    }
    return <a href={thread.url} target="_blank" class="link">{thread.url}</a>
  } else if (thread.type == "image") {
    return <div class="img"><a href={thread.src} target="_blank"><img src={thread.src} alt={thread.title} /></a></div>
  }
}
