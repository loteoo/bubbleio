
import {Socket} from '../utils'

import {ReceiveBubbles} from './actions'

export const subscriptions = state => {
  console.log(state)
  return [
    Socket.listen({
      event: 'receive bubbles',
      action: ReceiveBubbles
    })
  ]
}

