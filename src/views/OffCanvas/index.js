import {h} from 'hyperapp'
import { Link } from "@hyperapp/router"


export const OffCanvas = () => (state, actions) =>
<aside class="off-canvas off-canvas-sidebar-show">


  <div id="sidebar-id" class="off-canvas-sidebar">

    {state.user ? <GuestSidebar /> : <UserSidebar user={state.user} />}

  </div>

  <a class="off-canvas-overlay" href="#close"></a>
</aside>


// <aside>

//   {state.user ? state.user.username : null}

//   {state.user ? state.user.bubble_names.map(bubbleName => <BubbleLink bubble={state.bubbles[bubbleName]} />) : null}
//   <NewBubbleLink />


// </aside>

const UserSidebar = () => (
  <ul class="menu">
    <li class="menu-item">
      <div class="tile tile-centered">
        <div class="tile-icon"><img class="avatar" src="img/avatar-4.png" alt="Avatar" /></div>
        <div class="tile-content">Steve Rogers</div>
      </div>
    </li>
    <li class="divider"></li>
    <li class="menu-item">
      <div class="menu-badge">
        <label class="label label-primary">2</label>
      </div>
      <a class="active" href="#menus">My profile</a>
    </li>
    <li class="menu-item"><a href="#menus">Settings</a></li>
    <li class="menu-item"><a href="#menus">Logout</a></li>
    
    <li class="divider"></li>

    <li class="menu-item">
      <div class="menu-badge">
        <label class="label label-primary">4</label>
      </div>
      <a class="active" href="#menus">General</a>
    </li>

  </ul>
)


const GuestSidebar = () => (
  <div class="panel">
    <div class="panel-header text-center">
      <figure class="avatar avatar-lg"><img src="img/avatar-2.png" alt="Avatar" /></figure>
      <div class="panel-title h5 mt-10">Bruce Banner</div>
      <div class="panel-subtitle">THE HULK</div>
    </div>
    <nav class="panel-nav">
      <ul class="tab tab-block">
        <li class="tab-item active"><a href="#panels">Profile</a></li>
        <li class="tab-item"><a href="#panels">Files</a></li>
        <li class="tab-item"><a href="#panels">Tasks</a></li>
      </ul>
    </nav>
    <div class="panel-body">
      <div class="tile tile-centered">
        <div class="tile-content">
          <div class="tile-title text-bold">E-mail</div>
          <div class="tile-subtitle">bruce.banner@hulk.com</div>
        </div>
        <div class="tile-action">
          <button class="btn btn-link btn-action btn-lg tooltip tooltip-left" data-tooltip="Edit E-mail"><i class="icon icon-edit"></i></button>
        </div>
      </div>
    </div>
    <div class="panel-footer">
      <button class="btn btn-primary btn-block">Login</button>
    </div>
  </div>
)


const BubbleLink = ({bubble}) =>
<Link to={bubble.name}>
  {bubble.title} {bubble.userCount}
</Link>

const NewBubbleLink = () =>
<Link to="/new-bubble">
  New Bubble
</Link>
