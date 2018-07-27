import {location} from "@hyperapp/router"
import deepmerge from "deepmerge"
import {ObjectID, dontMerge, storeStateInStorage} from '../utils/'
import io from 'socket.io-client/dist/socket.io.slim'

export const actions = {
  location: location.actions,
  update: fragment => state => deepmerge(state, fragment, {arrayMerge: dontMerge}),
  set: fragment => fragment,
  init: () => (state, actions) => {

    // Activate our router
    window.unsubscribe = location.subscribe(main.location);

    // Websocket connect
    window.socket = io.connect(window.location.hostname);

    // // Subscribe to socket events
    window.socket.on('update state', newState => main.update(newState));


    // Login on load (sets a username on our socket connection)
    if (state.user) {
      socket.emit('login', {
        username: state.user.username
      });
    }


  },

  openLoginForm: () => (state, actions) => {
    actions.update({loginForm: {opened: true}});
  }
  
}
