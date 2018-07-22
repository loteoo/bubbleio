
import {h} from 'hyperapp'

import { Link, Route } from "@hyperapp/router"

import './thread-item.css'

export const ThreadItem = ({thread, bubble}) => (
  <div class="thread-item" key={thread._id}>
    <Link to={`/${bubble.name}/${thread._id}`}>{thread.title}</Link>
    <h6>{thread.author}</h6>
    <div class="bottom">
      <div class="infos">
        <span>{thread.score} points</span>
        <span>{thread.userCount} users</span>
        <span>{thread.messageCount} messages</span>
      </div>
      <div class="actions">
        <button>UP</button>
        <button>DOWN</button>
      </div>
    </div>
  </div>
)