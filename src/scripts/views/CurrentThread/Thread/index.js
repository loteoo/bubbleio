import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"
import {timeSince, shortenText, getYoutubeId} from '../../../utils/'
import {ThreadHeader, ThreadFooter} from '../../CurrentBubble/ThreadItem/'


export const Thread = ({currentThread, currentBubble}) => (state, actions) =>
  <article key={currentThread._id} class="thread" type={currentThread.type} upvoted={currentThread.upvoted}>
    <div class="thread-header">
      <div class="back" onclick={ev => {
        actions.location.go("/" + currentBubble.name);
      }}></div>
      <ThreadHeader thread={currentThread} currentBubble={currentBubble} />
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
      <div class="panel">
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


export const ThreadFullContent = ({thread, currentBubble}) => {
  if (thread.type == "default") {
    return
  } else if (thread.type == "text") {
    return <div class="text">{thread.text}</div>;
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
