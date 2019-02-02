import {h} from 'hyperapp'



export const Bubble = ({bubble}) => bubble && (
  <div class="bubble">
    <h2>{bubble.title}</h2>
    <p>{bubble.description}</p>
  </div>
)