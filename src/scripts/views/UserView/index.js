import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"

import {BubbleForm} from './BubbleForm/'

export const UserView = ({currentBubble}) => (state, actions) =>
  <div class="user-view">
    <div class="frame">
      <div class="header">
        <h2>{state.user.username}</h2>
        <div class="options">
          <button onclick={ev => {
            if (ev.target.nextSibling.classList.contains("opened")) {
              ev.target.nextSibling.classList.remove("opened")
            } else {
              ev.target.nextSibling.classList.add("opened")
            }
          }}>
          </button>
          <ul>
            <li onclick={ev => {
              console.log("logout");
              localStorage.clear();
              location.reload();
            }}><span>Log out</span></li>
            <LayoutModeSwitcher />
          </ul>
        </div>
      </div>
      <ul class="menu">
        <li>
          <span>My bubbles</span>
          <ul class="bubbles">
            {state.bubbles.map(bubble => <BubbleItem bubble={bubble} currentBubble={currentBubble} />)}
            <li onclick={ev => {
              ev.target.nextSibling.classList.add("opened");
            }}>
              <span>Create bubble</span>
              <BubbleForm />
            </li>
          </ul>
        </li>
        <li>
          <span>Multibubbles</span>
          <ul>
            <li>
              <span>All my bubbles</span>
            </li>
            <li>
              <span>Create Multibubble</span>
            </li>
          </ul>
        </li>
        <li>
          <span>Other</span>
          <ul>
            <li onclick={ev => {
              socket.emit("random bubble");
            }}>
              <span>Random</span>
            </li>
          </ul>
        </li>
      </ul>
      <footer></footer>
    </div>
  </div>

// TODO: micro animation when the user count changes?
const BubbleItem = ({bubble, currentBubble}) =>
  <li current={(bubble.name == Object.assign({"name": ""}, currentBubble).name).toString()} userCount={bubble.userCount}>
    <Link to={"/" + bubble.name}>
      {bubble.title}
      <div class="users">
        <div class="icon"></div>
        <span class="count">{bubble.userCount}</span>
      </div>
    </Link>
  </li>


const LayoutModeSwitcher = () => (state, actions) => {
  if (state.user.layoutMode == "default") {
    return (
      <li onclick={ev => {
        ev.target.parentElement.parentElement.classList.remove("opened");
        actions.updateState({
          user: {
            layoutMode: "compact"
          }
        });
        console.log(state.user.layoutMode);
      }}><span>Use compact layout</span></li>
    )
  } else {
    return (
      <li onclick={ev => {
        ev.target.parentElement.parentElement.classList.remove("opened");
        actions.updateState({
          user: {
            layoutMode: "default"
          }
        });
      }}><span>Use default layout</span></li>
      )
  }
}
