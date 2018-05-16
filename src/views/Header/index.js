import {h} from 'hyperapp'

import "@material/top-app-bar/dist/mdc.top-app-bar.css";

import {MDCTopAppBar} from '@material/top-app-bar';

export const Header = () => (state, actions) =>

<header class="mdc-top-app-bar" oncreate={el => {
  el.topAppBar = new MDCTopAppBar(el);
}}>
  <div class="mdc-top-app-bar__row">
    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
      <a href="#" class="material-icons mdc-top-app-bar__navigation-icon" onclick={ev => {
        ev.target.parentElement.parentElement.parentElement.nextSibling.drawer.open = true;
      }}>menu</a>
      <span class="mdc-top-app-bar__title">Title</span>
    </section>
  </div>
</header>
