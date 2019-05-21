/* eslint-disable fp/no-mutation */

import io from 'socket.io-client/dist/socket.io.slim'

const socket = io.connect('http://localhost:8888')



// Socket.io baggy (subs & effects builders)
export const Socket = {

  emit: (props) => ({
    effect: (props, dispatch) => {
      socket.emit(props.event, props.data, res => dispatch(props.action, res))
    },
    event: props.event,
    data: props.data,
    action: props.action
  }),

  // Listen to location changes
  on: props => ({
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








// Location baggy
export const Location = {

  go: (props) => ({
    effect: (props, dispatch) => {
      history.pushState(null, '', props.to)
      dispatchEvent(new CustomEvent('pushstate'))
    },
    to: props.to
  }),

  // Listen to location changes
  changed: props => ({
    effect: (props, dispatch) => {
      const handleLocationChange = ev => {
        dispatch(props.action, window.location.pathname)
      }
      addEventListener('pushstate', handleLocationChange)
      addEventListener('popstate', handleLocationChange)
      return () => {
        removeEventListener('pushstate', handleLocationChange)
        removeEventListener('popstate', handleLocationChange)
      }
    },
    action: props.action
  })
}




// DOM custom event (hyperapp will treat this like any other event)
export const enableOnMountDomEvent = () => {
  const mountEvent = new Event('mount')
  const realCreateElement = document.createElement.bind(document)
  document.createElement = (name) => {
    const el = realCreateElement(name)
    setTimeout(() => el.dispatchEvent(mountEvent))
    return el
  }
}
