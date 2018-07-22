
import {h} from 'hyperapp'

import { Link, Route } from "@hyperapp/router"

import {ThreadFooter} from '../ThreadFooter/ThreadFooter.js'


import './thread-item.css'

export const ThreadItem = ({thread, bubble}) => (
  <div class="thread-item" key={thread._id}>
    <Link to={`/${bubble.name}/${thread._id}`}>{thread.title}</Link>
    <h6>{thread.author}</h6>
    <ThreadFooter thread={thread} />
  </div>
)