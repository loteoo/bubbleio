import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"
import {timeSince, shortenText, shortenString, panelDrag, getYoutubeId, getVimeoId} from '../../../utils/'
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
        <ul>
          <NotificationToggle currentThread={currentThread} />
          <li onclick={ev => {
            console.log("Saving comming soon...");
          }}><span>Save</span></li>
          <DeleteThread currentThread={currentThread} />
        </ul>
      </div>
    </div>
    <div class="panelScroll">
      <div class="panel" onmousedown={panelDrag.onmousedown} onmousemove={panelDrag.onmousemove} onmouseup={panelDrag.onmouseup} onmouseout={panelDrag.onmouseup}>
        <ThreadContent thread={currentThread} currentBubble={currentBubble} />
        <ThreadFooter thread={currentThread} />
      </div>
    </div>
  </article>



export const DeleteThread = ({currentThread}) => (state, actions) => {
  if (currentThread.author == state.user.username) { // If user owns this thread
    return (
      <li onclick={ev => {
        actions.deleteThread(currentThread)
        socket.emit('archive thread', currentThread)
      }}><span>Delete</span></li>
    )
  }
}

export const NotificationToggle = ({currentThread}) => (state, actions) => {
  if (currentThread.notifications === true) {
    return (
      <li onclick={ev => {
        console.log("Comming soon...");
        actions.updateState({
          bubbles: [
            {
              _id: currentThread.bubble_id,
              threads: [
                {
                  _id: currentThread._id,
                  notifications: false
                }
              ]
            }
          ]
        });
      }}><span>Turn off notifications</span></li>
    )
  } else {
    return (
      <li onclick={ev => {
        console.log("Comming soon...");
        actions.updateState({
          bubbles: [
            {
              _id: currentThread.bubble_id,
              threads: [
                {
                  _id: currentThread._id,
                  notifications: true
                }
              ]
            }
          ]
        });
      }}><span>Turn on notifications</span></li>
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
  <div class="link">
    <a href={thread.url} target="_blank">
      {shortenString(thread.url, 32)}
    </a>
  </div>

const ImageThreadContent = ({thread}) =>
  <a href={thread.src} target="_blank" class="img">
    <img src={thread.src} alt={thread.title} />
  </a>

const YoutubeThreadContent = ({thread}) =>
  <iframe width="480" height="270" src={"https://www.youtube-nocookie.com/embed/"+getYoutubeId(thread.url)+"?rel=0&amp;controls=0"} frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

const VimeoThreadContent = ({thread}) =>
  <iframe src={"https://player.vimeo.com/video/"+getVimeoId(thread.url)} width="480" height="270" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
