import {h} from 'hyperapp'


const handleLoginForm = ev => state => {
  ev.preventDefault();
  socket.emit('login', {
    username: ev.target.username.value
  });
}


export const LoginForm = () => (state, actions) =>
  <form class="login-form" method="post" onsubmit={handleLoginForm}>

LOGIN
  </form>
