import {h} from 'hyperapp'

import './style.css'

const OnInput = (state, ev) => setter(state, name, ev.target.value)

// Exported component
export const TextInput = ({label, name, hint, value, setter, ...rest}) => {
  return (
    <div class="text-input">
      <label for={name}>{label}</label>
      <input type="text" name={name} id={name} value={value} oninput={OnInput} {...rest} />
      {hint ? <p class="hint">{hint}</p> : null}
    </div>
  )
}
