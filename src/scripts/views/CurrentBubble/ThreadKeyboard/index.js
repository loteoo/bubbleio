import {h} from 'hyperapp'
import {ObjectId} from '../../../utils/'


export const ThreadKeyboard = ({currentBubble}) => (state, actions) =>
  <form class="keyboard threadKeyboard" data-mode="default" onsubmit={ev => {
    ev.preventDefault();

    if (ev.target.title.value) {


      // Create the thread object
      let thread = {
        _id: ObjectId(),
        title: ev.target.title.value,
        score: 0,
        created: new Date().getTime(),
        type: ev.target.dataset.mode,
        author: state.user.username,
        bubble_id: currentBubble._id
      }

      if (ev.target.dataset.mode == "text") {
        thread.text = ev.target.text.value;
      } else if (ev.target.dataset.mode == "link") {
        thread.url = ev.target.link.value;
      } else if (ev.target.dataset.mode == "image") {
        thread.src = ev.target.image_link.value;
      }


      // Append thread to list immediately
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


      setTimeout(() => { // Scroll to top after the re-render/update cycle has ended (to include the new element's height)
        var threadList = document.querySelector(".bubble-view .frame");
        threadList.scrollTop = 0;
      }, 10)


      // Send new thread to server
      socket.emit('new thread', thread);


      ev.target.classList.remove("opened")
      ev.target.dataset.mode = "default";
      ev.target.reset();
    }

    return false;
  }}>
    <div class="expander" onclick={ev => {
        if (ev.target.classList.contains("opened")) {
          ev.target.parentElement.classList.remove("opened")
            ev.target.classList.remove("opened")
        } else {
          ev.target.classList.add("opened")
        }
      }}>
      <div class="default" onclick={ev => {
        ev.target.parentElement.parentElement.dataset.mode = "default";
        ev.target.parentElement.classList.remove("opened")
        ev.target.parentElement.parentElement.classList.add("opened")
      }}></div>
      <div class="text" onclick={ev => {
        ev.target.parentElement.parentElement.dataset.mode = "text";
        ev.target.parentElement.classList.remove("opened")
        ev.target.parentElement.parentElement.classList.add("opened")
      }}></div>
      <div class="link" onclick={ev => {
        ev.target.parentElement.parentElement.dataset.mode = "link";
        ev.target.parentElement.classList.remove("opened")
        ev.target.parentElement.parentElement.classList.add("opened")
      }}></div>
      <div class="image" onclick={ev => {
        ev.target.parentElement.parentElement.dataset.mode = "image";
        ev.target.parentElement.classList.remove("opened")
        ev.target.parentElement.parentElement.classList.add("opened")
      }}></div>
    </div>
    <input type="text" name="title" placeholder="Type something..." class="title" maxlength="50" />
    <textarea name="text" placeholder="Type something..." maxlength="8000"></textarea>
    <input type="text" name="link" placeholder="Paste link here" class="link" />
    <div class="image">
      <label for="image_file"></label>
      <input type="file" name="image_file" id="image_file" />
      <input type="text" name="image_link" placeholder="Paste link here" />
    </div>
    <button type="submit" class="submit"></button>
  </form>
