import {location} from "@hyperapp/router"
import deepmerge from "deepmerge"
import {ObjectID, dontMerge} from '../utils/'


export const actions = {
  location: location.actions,
  updateState: fragment => state => deepmerge(state, fragment, {arrayMerge: dontMerge}),
  init: () => (state, actions) => {

    // Activate our router
    window.unsubscribe = location.subscribe(main.location);

    // Websocket connect
    window.socket = io.connect(window.location.host);

    // Subscribe to socket events
    window.socket.on('update state', newState => main.updateState(newState));


    // Login on load (sets a username on our socket connection)
    if (state.user._id) {
      socket.emit('login', {
        username: state.user.username
      });
    }


  },
  handleLoginForm: ev => state => {
    ev.preventDefault();
    socket.emit('login', {
      username: ev.target.username.value
    });
  }
  },
  handleNewBubbleForm: ev => state => {
    ev.preventDefault();
    console.log("New bubble!");
  }
}
