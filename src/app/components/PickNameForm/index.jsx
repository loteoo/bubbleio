import {h} from 'hyperapp'


import {TextInput} from '../../theme/TextInput'
import {Socket} from '../../../utils'


// Init
const init = {
  name: ''
}



const ReceiveLoginInfo = (state, user) => {
  return {
    ...state,
    user
  }
}

// Actions
const HandlePickNameForm = (state, ev) => {
  ev.preventDefault()
  return [
    {
      ...state,
      pickNameForm: {
        ...state.pickNameForm,
        name: ''
      }
    },
    Socket.emit({
      event: 'pick name',
      data: state.pickNameForm.name,
      action: ReceiveLoginInfo
    })
  ]
}




const SetPickNameForm = (state, key, value) => ({
  ...state,
  pickNameForm: {
    ...state.pickNameForm,
    [key]: value
  }
})



export const PickNameForm = ({pickNameForm = pickNameForm || init}) => (
  <form method="post" class="pick-name-form" onsubmit={HandlePickNameForm}>
    <input
      type="text"
      name="name"
      value={pickNameForm.name}
      oninput={(state, ev) => SetPickNameForm(state, 'name', ev.target.value)}
    />
    <button type="submit">Pick a name</button>
  </form>
)



