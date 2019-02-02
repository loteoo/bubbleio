
import io from 'socket.io-client/dist/socket.io.slim'

const socket = io.connect('http://localhost:8888')

// Socket.io baggy (subs & effects builders)
export const Socket = {

  // Listen to location changes
  listen: props => ({
    effect: (props, dispatch) => {
      socket.on(props.event, data => {
        dispatch(props.action, data)
      })
      return () => socket.off(props.event)
    },
    event: props.event,
    action: props.action
  })
}
