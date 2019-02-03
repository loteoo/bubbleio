import {h} from 'hyperapp'

import {Socket, Location} from '../../../utils'


export const Thread = ({thread}) => (
  <div class="thread content-panel">
    <button onclick={(state) => [state, Location.go({to: '/' + state.location.bubbleName})]}>Back</button>
    <h2>Thread</h2>
    {/* <h2>{thread.title}</h2>
    <p>{thread.text}</p> */}
  </div>
)
