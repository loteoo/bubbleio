
import {h} from 'hyperapp'

import './message.css'

export const Message = ({message}) => (
  <div class="message" key={message._id}>
    <b>{message.userId.username}</b>
    <p>{message.text}</p>
  </div>
)