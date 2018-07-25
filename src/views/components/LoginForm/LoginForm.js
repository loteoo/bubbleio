
import {h} from 'hyperapp'
import cc from 'classcat'

import './login-form.css'

const set = fragment => (state, actions) => actions.update({
  loginForm: fragment
});


const handleThreadForm = (ev, bubble) => (state, actions) => {
  ev.preventDefault();

  
}

export const LoginForm = () => (state, actions, {username, password, opened} = state.loginForm || {}) => (
  <form class={cc(['login-form', {opened}])} key="login-form" method="post" onsubmit={ev => handleThreadForm(ev, bubble)(state, actions)}>
    <h2>Login</h2>
    <input type="text" name="username" oninput={ev => set({username: ev.target.value})(state, actions)} />
    <input type="text" name="password" oninput={ev => set({password: ev.target.value})(state, actions)} />
  </form>
)