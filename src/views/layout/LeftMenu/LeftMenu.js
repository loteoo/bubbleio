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
      <Link class="bubble-link" to="/">Home</Link>
      {user.bubbleNames.map(bubbleName => <BubbleLink bubble={state.bubbles[bubbleName]} />)}
    </nav>
  </div>
)



const GuestSidebar = () => (state, actions) => (
  <div class="left-menu">
    <div class="heading">
      Bubbleio
    </div>
    <nav class="menu">
    
      <Link class="bubble-link" to="/">Home</Link>
      {
        Object.keys(state.bubbles)
        .map(bubbleName => <BubbleLink bubble={state.bubbles[bubbleName]} />)
      }
      <button class="bubble-link" onclick={actions.openLoginForm}>Login</button>
      
    </nav>
  </div>
)





const BubbleLink = ({bubble}) => (
  <Link class="bubble-link" to={`/${bubble.name}`}>
    {bubble.title} - {bubble.userCount}
  </Link>
)


