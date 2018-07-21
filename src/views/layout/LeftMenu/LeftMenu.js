import {h} from 'hyperapp'
import { Link } from "@hyperapp/router"


import './left-menu.css'

export const LeftMenu = () => (state, actions) => state.user ? <UserSidebar user={state.user} /> : <GuestSidebar />






const UserSidebar = ({user}) => (state, actions) => (
  <div class="left-menu">
    <div class="heading">
      {user.username}
    </div>
    <nav class="menu">
      {user.bubble_names.map(bubbleName => <BubbleLink bubble={state.bubbles[bubbleName]} />)}
    </nav>
  </div>
)



const GuestSidebar = () => (
  <div class="left-menu">
    <div class="heading">
      Bubbleio
    </div>
    <nav class="menu">
      <BubbleLink bubble={{title: "General", name: "general"}} />
    </nav>
  </div>
)



const BubbleLink = ({bubble}) => (
  <Link class="bubble-link" to={`/${bubble.name}`}>
    {bubble.title} - {bubble.userCount}
  </Link>
)


