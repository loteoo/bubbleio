import {h} from 'hyperapp'

export const NewBubbleForm = () => (state, actions) =>
  <form class="new-bubble-form" method="post" onsubmit={actions.handleNewBubbleForm}>
    <h2>Let's create a brand new bubble.</h2>
    <p>A welcoming home for a community of any common interest</p>

    <div class="mdc-text-field" oncreate={el => el.textField = new mdc.textField.MDCTextField(el)}>
      <input type="text" id="title" name="title" class="mdc-text-field__input"
             aria-controls="title-helper-text"
             aria-describedby="title-helper-text"
             minlength="3" maxlength="50" required />
      <label for="title" class="mdc-floating-label">Display name</label>
      <div class="mdc-line-ripple"></div>
    </div>
    <p id="title-helper-text" class="mdc-text-field-helper-text" aria-hidden="true" oncreate={el => el.helperText = new mdc.textField.MDCTextFieldHelperText(el)}>
      Pick a name for the bubble
    </p>

    <div class="mdc-text-field" oncreate={el => el.textField = new mdc.textField.MDCTextField(el)}>
      <input type="text" id="name" name="name" class="mdc-text-field__input"
             aria-controls="name-helper-text"
             aria-describedby="name-helper-text"
             pattern="[a-z0-9]+" minlength="3" maxlength="50" required />
      <label for="name" class="mdc-floating-label">Name alias</label>
      <div class="mdc-line-ripple"></div>
    </div>
    <p id="name-helper-text" class="mdc-text-field-helper-text" aria-hidden="true" oncreate={el => el.helperText = new mdc.textField.MDCTextFieldHelperText(el)}>
      Lowercase letters and numbers only.
    </p>

    <div class="mdc-text-field mdc-text-field--textarea" oncreate={el => el.textField = new mdc.textField.MDCTextField(el)}>
      <textarea id="textarea" class="mdc-text-field__input" rows="4" cols="40" name="description" required></textarea>
      <label for="textarea" class="mdc-floating-label">Description</label>
    </div>

    <h3 class="mdc-typography--subtitle1">Visibility</h3>

    <div class="mdc-form-field">
      <div class="mdc-radio">
        <input class="mdc-radio__native-control" type="radio" id="public" value="public" name="visibility" required checked />
        <div class="mdc-radio__background">
          <div class="mdc-radio__outer-circle"></div>
          <div class="mdc-radio__inner-circle"></div>
        </div>
      </div>
      <label for="public">Public</label>
    </div>

    <div class="mdc-form-field">
      <div class="mdc-radio">
        <input class="mdc-radio__native-control" type="radio" id="private" value="private" name="visibility" required />
        <div class="mdc-radio__background">
          <div class="mdc-radio__outer-circle"></div>
          <div class="mdc-radio__inner-circle"></div>
        </div>
      </div>
      <label for="private">Private</label>
    </div>

    <br />

    <button type="submit" class="mdc-button mdc-button--raised" oncreate={el => el.ripple = new mdc.ripple.MDCRipple(el)}>
      Submit
    </button>
  </form>
