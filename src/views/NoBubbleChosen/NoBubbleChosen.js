import {h} from 'hyperapp'

export const NoBubbleChosen = ({match}) => (state, actions) =>
  <div>
    <h1>No bubble chosen</h1>
    <h2>Pick a bubble</h2>
    <button class="mdc-button" oncreate={el => el.ripple = new mdc.ripple.MDCRipple(el)}>
      Button
    </button>
    <div>
      Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem 
      ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
    </div>
  </div>
