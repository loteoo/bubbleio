import {h} from 'hyperapp'

import {MDCTemporaryDrawer} from '@material/drawer';

import '@material/drawer/dist/mdc.drawer.css';
import '@material/list/dist/mdc.list.css';


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
      <a class="mdc-list-item mdc-list-item--activated" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>Inbox
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">star</i>Star
      </a>
    </nav>
  </nav>
</aside>
