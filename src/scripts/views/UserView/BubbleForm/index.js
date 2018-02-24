import {h} from 'hyperapp'


export const BubbleForm = () =>
  <form class="bubbleForm" onsubmit={ev => {
    ev.preventDefault();


    if (ev.target.title.value) {

      // Create the bubble object
      let bubble = {
        _id: ObjectId(),
        name: ev.target.name.value,
        title: ev.target.title.value,
        desc: ev.target.desc.value,
        visibility: ev.target.visibility.value,
        created: new Date().getTime()
      }

      // Append bubble to list immediately
      actions.updateState({
        bubbles: [
          bubble
        ]
      });


      // Send new bubble to server
      socket.emit('new bubble', bubble);

      ev.target.reset();
    }

  }}>
    <div class="close" onclick={ev => {
      ev.target.parentElement.classList.remove("opened");
    }}></div>
    <fieldset>
      <h2>Create a brand new bubble</h2>
      <input type="text" name="title" placeholder="Pick a name for the bubble" required />
      <input type="text" name="name" placeholder="Bubble alias" required />
      <textarea name="desc" placeholder="Describe this bubble and what should be posted here." required ></textarea>
      <p>Bubble visibility</p>
      <div class="row">
        <div class="radio">
          <input type="radio" name="visibility" value="public" id="public" checked />
          <label for="public">Public</label>
        </div>
        <div class="radio">
          <input type="radio" name="visibility" value="private" id="private" />
          <label for="private">Private</label>
        </div>
      </div>
      <button type="submit">Create bubble!</button>
    </fieldset>
  </form>
