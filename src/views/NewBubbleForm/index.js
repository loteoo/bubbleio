import {h} from 'hyperapp'

export const NewBubbleForm = () => (state, actions) =>
  <form class="new-bubble-form" method="post" onsubmit={actions.handleNewBubbleForm}>
    <h2>Let's create a brand new bubble.</h2>
    <p>A welcoming home for a community of any common interest</p>


  </form>
