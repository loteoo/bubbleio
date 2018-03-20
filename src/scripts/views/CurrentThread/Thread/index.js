import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"
import {timeSince, shortenText, getYoutubeId} from '../../../utils/'


export const Thread = ({currentThread, currentBubble}) => (state, actions) => {

  let contentBlock;
  if (currentThread.type == "default") {
    contentBlock = null
  } else if (currentThread.type == "text") {
    contentBlock = <div class="text">{currentThread.text}</div>;
  } else if (currentThread.type == "link") {
    if (currentThread.url.match('^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$')) { // If is youtube
      currentThread.src = "https://img.youtube.com/vi/"+getYoutubeId(currentThread.url)+"/hqdefault.jpg";
    }
    contentBlock = <a href={currentThread.url} target="_blank" class="link">{currentThread.url}</a>
  } else if (currentThread.type == "image") {
    contentBlock = <a href={currentThread.src} target="_blank" class="img"><img src={currentThread.src} alt={currentThread.title} /></a>
  }


  let canDelete;

  if (currentThread.author == state.user.username) { // If user owns this thread
    canDelete = <li onclick={ev => {
      actions.deleteThread(thread);
      socket.emit('archive thread', thread);
    }}><span>Delete</span></li>;
  }



  return (
    <li key={currentThread._id} class="thread" type={currentThread.type} upvoted={currentThread.upvoted}>
      <div class="header">
        <div class="thread-header">
          <div class="back" onclick={ev => {
            actions.location.go("/" + currentBubble.name);
          }}></div>
          <h2>{currentThread.title}</h2>
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
              <li onclick={ev => {
                  console.log("Saving comming soon...");
              }}><span>Save</span></li>
              <li onclick={ev => {
                  console.log("Downvote comming soon...");
              }}><span>Downvote</span></li>
              {canDelete}
            </ul>
          </div>
        </div>
        <p>{"by " + currentThread.author + " on " + currentBubble.name + " " + timeSince(currentThread.created)}</p>
      </div>
      {contentBlock}
    </li>
  )
}




// TODO: Add thread footer to the thread
