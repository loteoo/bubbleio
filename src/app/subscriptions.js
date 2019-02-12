
import {Socket, Location} from '../utils'

import {
  ReceiveBubbles,
  ReceiveMessage,
  ParseUrl
} from './actions'

export const subscriptions = state => {
  console.log(state)
  return [
    Socket.on({
      event: 'receive bubbles',
      action: ReceiveBubbles
    }),
    Socket.on({
      event: 'new message',
      action: ReceiveMessage
    }),
    Location.changed({
      action: ParseUrl
    })
  ]
}

