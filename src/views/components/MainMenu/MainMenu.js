import {h} from 'hyperapp'
import { Link } from "@hyperapp/router"


import './main-menu.css'

export const MainMenu = () => (state, actions) => state.user ? <UserMenu user={state.user} /> : <GuestMenu />


const UserMenu = ({user}) => (state, actions) => (
  <div class="main-menu">
    <div class="heading">
      {user.username}
    </div>
    <nav class="menu">
      <Link class="bubble-link" to="/">Home</Link>
      {
        Object.keys(state.bubbles)
        .map(bubbleName => <BubbleLink bubble={state.bubbles[bubbleName]} />)
      }
      <button class="bubble-link" onclick={actions.openBubbleForm}>Create bubble</button>
    </nav>
  </div>
)


const GuestMenu = () => (state, actions) => (
  <div class="main-menu">
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
    {bubble.title} - {bubble.userCount || 0}
  </Link>
)


