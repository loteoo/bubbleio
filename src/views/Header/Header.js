import {h} from 'hyperapp'



export const Header = () => (state, actions) =>
<header class="mdc-top-app-bar" oncreate={el => {
  el.topAppBar = new mdc.topAppBar.MDCTopAppBar(el);
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
