import {h} from 'hyperapp'


export const BubbleForm = () => (state, actions) => 
  <div class="overlay">
    <div class="inner">
      <div class="close" onclick={ev => {
          ev.target.parentElement.parentElement.classList.remove("opened");
      }}></div>
    <form class="bubbleForm" error={state.bubbleForm.error} onsubmit={ev => {
          ev.preventDefault();


          if (ev.target.title.value) {

            // Create the bubble object
            let bubble = {
              name: ev.target.name.value,
              title: ev.target.title.value,
              desc: ev.target.desc.value,
              visibility: ev.target.visibility.value,
              created: new Date().getTime()
            }

            // Send new bubble to server for validation
            socket.emit('new bubble', bubble);

            // ev.target.reset();
          }

      }}>
        <h2>Create a brand new bubble</h2>
        <fieldset>
          <label>Pick a name for the bubble</label>
          <input type="text" name="title" placeholder="Bubble Name" required />
        </fieldset>
        <fieldset>
          <label>Unique name alias</label>
          <input type="text" name="name" placeholder="Lowercase letters and numbers only" pattern="[a-z0-9]+" minlength="3" maxlength="50" required />
        </fieldset>
        <fieldset>
          <label>Describe this bubble and what should be posted here.</label>
          <textarea name="desc" placeholder="Bubble description..." required ></textarea>
        </fieldset>
        <fieldset>
          <label>Bubble visibility</label>
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
        </fieldset>
        <button type="submit">Create bubble!</button>
      </form>
    </div>
  </div>
