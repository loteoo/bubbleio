import {h} from 'hyperapp'


// Import actions
import {ToggleMenu} from '../../actions'

import {Location} from '../../../utils'

import './style.css'


const MenuItem = ({bubble, current}) => (
  <li>
    <a class={bubble.name === current ? 'active' : ''} onclick={(state) => [state, Location.go({to: '/' + bubble.name})]}>
      {bubble.title}
    </a>
  </li>
)

export const LeftMenu = ({state}) => [
  <aside class="left-menu">
    <header role="banner">
      <h2 class="username">{state.user ? state.user.name : 'Anonymous'}</h2>
      <p>{state.user && state.user.email}</p>
    </header>
    <nav role="navigation">
      <ul>
        {state.user && state.user.UserBubbles && state.user.UserBubbles.map(userBubble => <MenuItem bubble={userBubble.Bubble} current={state.location.bubbleName} />)}
      </ul>
      <ul>
        {state.menuBubbles.map(bubble => <MenuItem bubble={bubble} current={state.location.bubbleName} />)}
      </ul>
    </nav>
    <button onclick={ToggleMenu}>Toggle menu</button>
  </aside>,
  <div class="menu-overlay" onclick={ToggleMenu}></div>
]
