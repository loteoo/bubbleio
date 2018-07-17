import {location} from "@hyperapp/router"
import deepmerge from "deepmerge"
import {ObjectID, dontMerge} from '../utils/'
import io from 'socket.io-client/dist/socket.io.slim'

export const actions = {
  location: location.actions,
  update: fragment => state => deepmerge(state, fragment, {arrayMerge: dontMerge}),
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


  }
  
}
