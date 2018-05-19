import {location} from "@hyperapp/router"
import {ObjectID} from '../utils/'


export const actions = {
  location: location.actions,
  init: () => (state, actions) => {

    // Activate our router
    window.unsubscribe = location.subscribe(main.location);

    // Websocket connect
    window.socket = io.connect(window.location.host);

    // Login on load (sets a username on our socket connection)
    if (state.user._id) {
      socket.emit('login', {
        username: state.user.username
      });
    }


  },
  handleLoginForm: ev => state => {
    ev.preventDefault();

    console.log(ev);

  }
}
