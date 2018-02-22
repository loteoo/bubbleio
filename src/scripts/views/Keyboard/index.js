import {h} from 'hyperapp'


export const Keyboard = (state, actions) => (
  <form class={"keyboard " + state.keyboardMode} onsubmit={ev => { actions.keyboardSubmit(ev); return false; }}>
    <div class={"expander " + state.keyboardStatus} onclick={ev => actions.expandKeyboard(state.keyboardStatus)}>
      <div class="default" onclick={ev => { actions.changeKeyboardMode("default") }}>x</div>
      <div class="text" onclick={ev => { actions.changeKeyboardMode("text") }}>txt</div>
      <div class="link" onclick={ev => { actions.changeKeyboardMode("link") }}>url</div>
      <div class="image" onclick={ev => { actions.changeKeyboardMode("image") }}>pic</div>
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
)
