import {h} from 'hyperapp'


import './LoginForm.css'


export const LoginForm = () => (state, actions) =>
  <form class="login-form" method="post" onsubmit={actions.handleLoginForm}>
    <div class="mdc-text-field" oncreate={el => el.textField = new mdc.textField.MDCTextField(el)}>
      <input type="text" id="username" class="mdc-text-field__input" name="username" minlength="3" maxlength="50"></input>
      <label class="mdc-floating-label" for="username">Pick a name</label>
      <div class="mdc-line-ripple"></div>
    </div>
  </form>
