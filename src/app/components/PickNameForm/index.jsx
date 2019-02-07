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
    <TextInput
      name="name"
      label="Name"
      placeholder="Pick a name and share your thoughts!"
      value={pickNameForm.name}
      setter={SetPickNameForm}
    />
    <button filled>Pick a name</button>
    <button outlined>Log in</button>
  </form>
)



