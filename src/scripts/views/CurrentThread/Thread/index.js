import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"
import {timeSince, shortenText, getYoutubeId} from '../../../utils/'


export const Thread = (thread, currentBubble, state, actions) => {

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
    contentBlock = <a href={thread.src} target="_blank" class="img"><img src={thread.src} alt={thread.title} /></a>
  }

  if (!thread.src) {
    thread.src = "/img/thread_types/large/" + thread.type + ".svg";
  }

  let canDelete;

  if (thread.author == state.user.username) { // If user owns this thread
    canDelete = <li><span onclick={ev => {

      thread.archived = true;

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

      socket.emit('archive thread', thread);

    }}>Delete</span></li>;
  }



  return (
    <li key={thread._id} class="thread" data-type={thread.type} data-upvoted={thread.upvoted}>
      <div class="header">
        <div class="thread-header">
          <div class="back" onclick={ev => {
            actions.location.go("/" + currentBubble.name);
          }}></div>
          <h2>{thread.title}</h2>
          <div class="options">
            <button onclick={ev => {
              if (ev.target.nextSibling.classList.contains("opened")) {
                ev.target.nextSibling.classList.remove("opened")
              } else {
                ev.target.nextSibling.classList.add("opened")
              }
            }}>
            </button>
            <ul>
              <li><span>Downvote</span></li>
              <li><span>Save</span></li>
              {canDelete}
            </ul>
          </div>
        </div>
        <p>{"by " + thread.author + " on " + currentBubble.name + " " + timeSince(thread.created)}</p>
      </div>
      {contentBlock}
    </li>
  )
}




// TODO: Add thread footer to the thread
