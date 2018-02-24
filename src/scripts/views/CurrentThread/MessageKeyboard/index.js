import {h} from 'hyperapp'
import {ObjectId} from '../../../utils/'

export const MessageKeyboard = (currentThread, state, actions) =>
  <form class="keyboard" data-mode="default" onsubmit={ev => {
      ev.preventDefault();


      if (ev.target.title.value) {

        // Create the message object
        let message = {
          _id: ObjectId(),
          bubble_id: currentThread.bubble_id,
          thread_id: currentThread._id,
          sender: state.user.username,
          message: ev.target.title.value,
          created: new Date().getTime()
        }

        // Append message to list immediately
        actions.updateState({
          bubbles: [
            {
              _id: message.bubble_id,
              threads: [
                {
                  _id: message.thread_id,
                  messages: [
                    message
                  ]
                }
              ]
            }
          ]
        });


        // Send new message to server
        socket.emit('new message', message);


        ev.target.dataset.mode = "default";
        ev.target.reset();
      }

      return false;
    }}>
    <div class="expander" onclick={ev => ev.target.classList.contains("opened") ? ev.target.classList.remove("opened") : ev.target.classList.add("opened")}>
      <div class="default" onclick={ev => { ev.target.parentElement.parentElement.dataset.mode = "default"; ev.target.parentElement.classList.remove("opened") }}></div>
      <div class="text" onclick={ev => { ev.target.parentElement.parentElement.dataset.mode = "text"; ev.target.parentElement.classList.remove("opened") }}></div>
      <div class="link" onclick={ev => { ev.target.parentElement.parentElement.dataset.mode = "link"; ev.target.parentElement.classList.remove("opened") }}></div>
      <div class="image" onclick={ev => { ev.target.parentElement.parentElement.dataset.mode = "image"; ev.target.parentElement.classList.remove("opened") }}></div>
    </div>
    <input type="text" name="title" placeholder="Type something..." class="title" />
    <textarea name="text" placeholder="Type something..."></textarea>
    <input type="text" name="link" placeholder="Paste link here" class="link" />
    <div class="image">
      <label for="image_file"></label>
      <input type="file" name="image_file" id="image_file" />
      <input type="text" name="image_link" placeholder="Or paste link here" />
    </div>
    <button type="submit" class="submit"></button>
  </form>
