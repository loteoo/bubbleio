
import {h} from 'hyperapp'

import { Link, Route } from "@hyperapp/router"

import './thread-item.css'

export const ThreadItem = ({thread, bubble}) => (
  <div key={thread._id} class="thread-item">
    <h4>{thread.title}</h4>
    <p>{thread.author}</p>
    <Link to={`/${bubble.name}/${thread._id}`}>{thread._id}</Link>
  </div>
)