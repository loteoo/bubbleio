
import {h} from 'hyperapp'
import cc from 'classcat'

import {NiceInput} from '../../common/NiceInput/NiceInput.js'
import {ModalContainer} from '../../common/ModalContainer/ModalContainer.js'

import './login-form.css'

const set = fragment => main.update({loginForm: fragment});


const handleSubmit = (ev) => (state, actions, {username, password, mode} = state.loginForm) => {
  ev.preventDefault();

  socket.emit('login', {username, password, mode});
}

export const LoginForm = ({username, password, mode = mode || 'login', opened}) => (state, actions) => (
  <ModalContainer opened={opened} close={() => set({opened: false})}>
    <form class="login-form" key="login-form" method="post" onsubmit={ev => handleSubmit(ev)(state, actions)}>
      <h2>Login</h2>
      <NiceInput label="Username" name="username" value={username} required setter={set} />
      <NiceInput label="Password" name="password" value={password} required setter={set} />
      <button type="submit">Login</button>
    </form>
  </ModalContainer>
)