import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"


import './MainContainer.css'


export const MainContainer = () => (state, actions) =>
<main class="main-container mdc-top-app-bar--fixed-adjust">



  <button class="mdc-button" oncreate={el => el.ripple = new mdc.ripple.MDCRipple(el)}>
    Button
  </button>


  <div>
    Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
  </div>


</main>
