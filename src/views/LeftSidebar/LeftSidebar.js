import {h} from 'hyperapp'


export const LeftSidebar = () => (state, actions) =>
<aside class="mdc-drawer mdc-drawer--temporary mdc-typography" oncreate={el => {
    el.drawer = new mdc.drawer.MDCTemporaryDrawer(el);
}}>
  <nav class="mdc-drawer__drawer">
    <header class="mdc-drawer__header">
      <div class="mdc-drawer__header-content">
        Header here
      </div>
    </header>
    <nav id="icon-with-text-demo" class="mdc-drawer__content mdc-list">
      {state.user.bubble_ids.map(bubbleId => <MenuItem bubble={state.bubbles[bubbleId]} />)}
    </nav>
  </nav>
</aside>

const MenuItem = ({bubble}) =>
<a class="mdc-list-item" href="#" oncreate={el => {
    el.ripple = new mdc.ripple.MDCRipple(el);
}}>
  <i class="material-icons mdc-list-item__graphic" aria-hidden="true">star</i>{bubble.title}
</a>
