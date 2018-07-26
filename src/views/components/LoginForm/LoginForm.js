
import {h} from 'hyperapp'
import cc from 'classcat'

import {NiceInput} from '../../common/NiceInput/NiceInput.js'
import {ModalContainer} from '../../common/ModalContainer/ModalContainer.js'

import './login-form.css'

const set = fragment => main.update({loginForm: fragment});


const handleThreadForm = (ev, bubble) => (state, actions) => {
  ev.preventDefault();

  
}

export const LoginForm = () => (state, actions, {username, password, opened} = state.loginForm || {}) => (
  <ModalContainer opened={opened} close={() => set({opened: false})}>
    <form class="login-form" key="login-form" method="post" onsubmit={ev => handleThreadForm(ev, bubble)(state, actions)}>
      <h2>Login</h2>
      <NiceInput label="Username" name="username" setter={set} />
      <NiceInput label="Password" name="password" setter={set} />
    </form>
  </ModalContainer>
)