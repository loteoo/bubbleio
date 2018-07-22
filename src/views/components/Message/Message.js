
import {h} from 'hyperapp'

import './message.css'

export const Message = ({message}) => (
  <div class="message" key={message._id}>
    {message.message}
  </div>
)