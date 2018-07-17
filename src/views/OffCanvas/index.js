import {h} from 'hyperapp'
import { Link } from "@hyperapp/router"


export const OffCanvas = () => (state, actions) =>
<aside class="off-canvas off-canvas-sidebar-show">


  <div id="sidebar-id" class="off-canvas-sidebar">

    {state.user ? <UserSidebar user={state.user} /> : <GuestSidebar />}

  </div>

  <a class="off-canvas-overlay" href="#close"></a>
</aside>





const UserSidebar = ({user}) => (
  <ul class="menu">
    <li class="menu-item">
      <div class="tile tile-centered">
        <div class="tile-icon"><img class="avatar" src="img/avatar-4.png" alt="Avatar" /></div>
        <div class="tile-content">{user.username}</div>
      </div>
    </li>
    <li class="divider"></li>
    <li class="menu-item"><a href="#menus">My profile</a></li>
    <li class="menu-item"><a href="#menus">Settings</a></li>
    <li class="menu-item"><a href="#menus">Logout</a></li>
    
    <li class="divider"></li>

    {state.user ? state.user.bubble_names.map(bubbleName => <BubbleLink bubble={state.bubbles[bubbleName]} />) : null}

    <li class="menu-item">
      <div class="menu-badge">
        <label class="label label-primary">4</label>
      </div>
      <a class="active" href="#menus">General</a>
    </li>

  </ul>
)



const GuestSidebar = () => (
  <ul class="menu">
    <li class="menu-item">
      <button class="btn btn-primary btn-block">Pick a name</button>
    </li>
    <li class="divider"></li>

    <li class="menu-item">
      <div class="menu-badge">
        <label class="label label-primary">4</label>
      </div>
      <a class="active" href="#menus">General</a>
    </li>
    
    
    

  </ul>
  
)



const BubbleLink = ({bubble}) =>
<Link to={bubble.name}>
  {bubble.title} {bubble.userCount}
</Link>

const NewBubbleLink = () =>
<Link to="/new-bubble">
  New Bubble
</Link>
