import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"



export const UserView = ({state, actions}) => (
  <div class="global-view">
    <div class="frame">
      <h2>{state.user.username}</h2>
      <ul class="bubbles">
        {state.bubbles.map(BubbleItem)}
        <li><span>Create bubble</span></li>
      </ul>
    </div>
  </div>
)


const BubbleItem = (bubble) => (
  <li>
    <Link to={"/" + bubble.name}>{bubble.title + " (" + bubble.userCount + ")"}</Link>
  </li>
)
