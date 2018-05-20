import {h} from 'hyperapp'
import { Link } from "@hyperapp/router"


export const LeftSidebar = () => (state, actions) =>
<aside class="mdc-drawer mdc-drawer--temporary mdc-typography" oncreate={el => {
    el.drawer = new mdc.drawer.MDCTemporaryDrawer(el);
}}>
  <nav class="mdc-drawer__drawer">
    <header class="mdc-drawer__header">
      <div class="mdc-drawer__header-content">
        {state.user.username}
      </div>
    </header>
    <nav id="icon-with-text-demo" class="mdc-drawer__content mdc-list">
      {state.user.bubble_names.map(bubbleName => <MenuItem bubble={state.bubbles[bubbleName]} />)}
    </nav>
  </nav>
</aside>

const MenuItem = ({bubble}) =>
<Link to={bubble.name} class="mdc-list-item" oncreate={el => {
    el.ripple = new mdc.ripple.MDCRipple(el);
}}>
  <i class="material-icons mdc-list-item__graphic" aria-hidden="true">star</i>{bubble.title} {bubble.userCount}
</Link>
