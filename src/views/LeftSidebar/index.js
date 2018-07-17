import {h} from 'hyperapp'
import { Link } from "@hyperapp/router"


export const LeftSidebar = () => (state, actions) =>
<aside>

  {state.user.username}

  {state.user.bubble_names.map(bubbleName => <BubbleLink bubble={state.bubbles[bubbleName]} />)}
  <NewBubbleLink />


</aside>

const BubbleLink = ({bubble}) =>
<Link to={bubble.name}>
  {bubble.title} {bubble.userCount}
</Link>

const NewBubbleLink = () =>
<Link to="/new-bubble">
  New Bubble
</Link>
