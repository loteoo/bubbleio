import {h} from 'hyperapp'
import cc from 'classcat'

import './modal-container.css'

const Close = () => <div class="close"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div>

export const ModalContainer = ({opened, close}, children) => (
  <div class={cc(['modal-container', {opened}])} key="modal-container" onclick={close}>
    <div class="modal" onclick={ev => ev.stopPropagation()}>
      <Close onclick={close} />
      {children}
    </div>
  </div>
)
