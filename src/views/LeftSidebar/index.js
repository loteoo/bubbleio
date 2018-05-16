import {h} from 'hyperapp'

import {MDCTemporaryDrawer} from '@material/drawer';
import {MDCRipple} from '@material/ripple';


import '@material/drawer/dist/mdc.drawer.css';
import '@material/list/dist/mdc.list.css';
import '@material/ripple/dist/mdc.ripple.css';
import '@material/button/dist/mdc.button.css';

export const LeftSidebar = () => (state, actions) =>
<aside class="mdc-drawer mdc-drawer--temporary mdc-typography" oncreate={el => {
    el.drawer = new MDCTemporaryDrawer(el);
    el.drawer.open = true;
}}>
  <nav class="mdc-drawer__drawer">
    <header class="mdc-drawer__header">
      <div class="mdc-drawer__header-content">
        Header here
      </div>
    </header>
    <nav id="icon-with-text-demo" class="mdc-drawer__content mdc-list">
      <MenuItem />
      <MenuItem />
      <button class="mdc-button" oncreate={el => {
          el.ripple = new MDCRipple(el);
      }}>
        Button
      </button>
    </nav>
  </nav>
</aside>

const MenuItem = () =>
  <a class="mdc-list-item" href="#" oncreate={el => {
      el.ripple = new MDCRipple(el);
  }}>
    <i class="material-icons mdc-list-item__graphic" aria-hidden="true">star</i>Star
  </a>
