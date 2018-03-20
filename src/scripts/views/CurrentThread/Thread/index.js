import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"
import {timeSince, shortenText, getYoutubeId} from '../../../utils/'
import {ThreadHeader, ThreadContent, ThreadFooter} from '../../CurrentBubble/ThreadItem/'


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
    <ThreadContent thread={currentThread} currentBubble={currentBubble} />
    <ThreadFooter thread={currentThread} />
  </article>



export const ThreadOptions = ({currentThread}) => (state, actions) => {
  if (currentThread.author == state.user.username) { // If user owns this thread
    return (
      <ul>
        <li onclick={ev => {
          actions.deleteThread(thread)
          socket.emit('archive thread', thread)
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
