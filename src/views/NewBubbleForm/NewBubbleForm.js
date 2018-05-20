import {h} from 'hyperapp'

export const NewBubbleForm = () => (state, actions) =>
  <div>
    <form method="post">
      <h2>Let's create a brand new bubble.</h2>
      <p>A welcoming home for a community of any common interest</p>

      <div class="mdc-text-field" oncreate={el => el.textField = new mdc.textField.MDCTextField(el)}>
        <input type="text" id="title" class="mdc-text-field__input"
             aria-controls="title-helper-text"
             aria-describedby="title-helper-text" />
        <label for="title" class="mdc-floating-label">Display name</label>
        <div class="mdc-line-ripple"></div>
      </div>
      <p id="title-helper-text" class="mdc-text-field-helper-text" aria-hidden="true" oncreate={el => el.helperText = new mdc.textField.MDCTextFieldHelperText(el)}>
        Pick a name for the bubble
      </p>

      <div class="mdc-text-field" oncreate={el => el.textField = new mdc.textField.MDCTextField(el)}>
        <input type="text" id="name" class="mdc-text-field__input"
               aria-controls="name-helper-text"
               aria-describedby="name-helper-text" />
        <label for="name" class="mdc-floating-label">Name alias</label>
        <div class="mdc-line-ripple"></div>
      </div>
      <p id="name-helper-text" class="mdc-text-field-helper-text" aria-hidden="true" oncreate={el => el.helperText = new mdc.textField.MDCTextFieldHelperText(el)}>
        Lowercase letters and numbers only.
      </p>

    </form>
  </div>
