
import {Socket, Location} from '../utils'

import {
  ReceiveBubbles,
  ParseUrl
} from './actions'

export const subscriptions = state => {
  console.log(state)
  return [
    Socket.on({
      event: 'receive bubbles',
      action: ReceiveBubbles
    }),
    Location.changed({
      action: ParseUrl
    })
  ]
}

