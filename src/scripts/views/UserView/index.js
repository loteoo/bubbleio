import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"

import {BubbleForm} from './BubbleForm/'

export const UserView = ({currentBubble, state, actions}) =>
  <div class="user-view">
    <div class="frame">
      <div class="header">
        <h2>{state.user.username}</h2>
      </div>
      <ul class="menu">
        <li>
          <span>My bubbles</span>
          <ul class="bubbles">
            {state.bubbles.map(bubble => <BubbleItem bubble={bubble} currentBubble={currentBubble} />)}
            <li>
              <span onclick={ev => {
                ev.target.nextSibling.classList.add("opened");
              }}>Create bubble</span>
            <BubbleForm actions={actions} />
            </li>
          </ul>
        </li>
        <li>
          <span>Multibubbles</span>
          <ul>
            <li>
              <span>Create Multibubble</span>
            </li>
          </ul>
        </li>
      </ul>
      <footer></footer>
    </div>
  </div>


const BubbleItem = ({bubble, currentBubble}) => {

  let currentClass = "";
  if (currentBubble) {
    if (bubble._id == currentBubble._id) {
      currentClass = "current";
    }
  }

  return (
    <li class={currentClass} data-userCount={bubble.userCount}>
      <Link to={"/" + bubble.name}>
        {bubble.title}
        <div class="users">
          <div class="icon"></div>
          <span class="count">{bubble.userCount}</span>
        </div>
      </Link>
    </li>
  )
}
