import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"
import {timeSince, shortenText, panelDrag} from '../../../utils/'
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
          <ThreadContent thread={currentThread} currentBubble={currentBubble} />
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


const ThreadFullHeader = ({thread, currentBubble}) =>
  <div class="header">
    <h2>{thread.title}</h2>
    <p>{"by " + thread.author + " on " + currentBubble.name + " " + timeSince(thread.created)}</p>
  </div>


const ThreadContent = ({thread, currentBubble}) => {
  if (thread.type == "default") {
    return
  } else if (thread.type == "text") {
    return <TextThreadContent thread={thread} />
  } else if (thread.type == "link") {
    return <LinkThreadContent thread={thread} />
  } else if (thread.type == "youtube") {
    return <YoutubeThreadContent thread={thread} />
  } else if (thread.type == "vimeo") {
    return <VimeoThreadContent thread={thread} />
  } else if (thread.type == "image") {
    return <ImageThreadContent thread={thread} />
  }
}





const TextThreadContent = ({thread}) =>
  <div class="text">
    {thread.text}
  </div>

const LinkThreadContent = ({thread}) =>
  <a href={thread.url} target="_blank" class="link">
    {shortenText(thread.url, 32)}
  </a>

const ImageThreadContent = ({thread}) =>
  <a href={thread.src} target="_blank" class="img">
    <img src={thread.src} alt={thread.title} />
  </a>

const YoutubeThreadContent = ({thread}) =>
  <a href={thread.url} target="_blank" class="linkPreview youtube">
    <img src={thread.thumbnail} alt={thread.title} />
  </a>

const VimeoThreadContent = ({thread}) =>
  <a href={thread.url} target="_blank" class="linkPreview vimeo">
    <img src={thread.thumbnail} alt={thread.title} />
  </a>
