import {h} from 'hyperapp'

export const NoBubbleChosen = ({match}) => (state, actions) =>
  <div class="empty" key="no-bubble-chosen">
    <div class="empty-icon">
      <i class="icon icon-people"></i>
    </div>
    <p class="empty-title h5">No bubble chosen</p>
    <p class="empty-subtitle">Pick a bubble</p>
    <div class="empty-action">
      <button class="btn btn-primary">Pick a bubble</button>
    </div>
  </div>