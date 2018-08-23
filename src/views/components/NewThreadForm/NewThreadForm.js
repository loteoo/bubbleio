
import {h} from 'hyperapp'

import {Modal} from '../../common/Modal/Modal.js'


import './new-thread-form.css'


const set = fragment => main.update({
  newThreadForm: fragment
});

const handleNewThreadForm = (ev, bubble) => (state, actions, {title, type = type || 'default'} = state.newThreadForm) => {
  ev.preventDefault();
  if (state.user) {
    socket.emit('new thread', {
      title,
      score: 0,
      type,
      trashed: false,
      userId: state.user._id,
      bubbleId: bubble._id
    });
    actions.set({newThreadForm: {}})
  } else {
    actions.openLoginForm()
  }
}

export const NewThreadForm = ({bubble}) => (
  state,
  actions,
  {title, type, opened} = state.newThreadForm || {}
) => (
  <Modal close={() => set({opened: false})}>
    <form class="new-thread-form" key="new-thread-form" method="post" onsubmit={ev => handleNewThreadForm(ev, bubble)(state, actions)}>
      <input type="text" name="title" id="title" placeholder="Type something..." value={title} oninput={ev => set({title: ev.target.value})} required />
      <button type="submit">Send</button>
    </form>
  </Modal>
)