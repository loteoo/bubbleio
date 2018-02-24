import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"



export const UserView = ({state}) =>
  <div class="user-view">
    <div class="frame">
      <div class="header">
        <h2>{state.user.username}</h2>
      </div>
      <ul class="menu">
        <li>
          <span>My bubbles</span>
          <ul class="bubbles">
            {state.bubbles.map(BubbleItem)}
            <li><span>Create bubble</span></li>
          </ul>
        </li>
        <li>
          <span>Multibubbles</span>
          <ul>
            <li><span>Create Multibubble</span></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>


const BubbleItem = (bubble) =>
  <li>
    <Link to={"/" + bubble.name}>{bubble.title + " (" + bubble.userCount + ")"}</Link>
  </li>
