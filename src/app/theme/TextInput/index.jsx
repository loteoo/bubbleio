import {h} from 'hyperapp'

import './style.css'



// Exported component
export const TextInput = ({label, name, hint, value, setter, ...rest}) => {

  const OnInput = (state, ev) => setter ? setter(state, name, ev.target.value) : state

  return (
    <div class="text-input">
      <label for={name}>{label}</label>
      <input
        type="text"
        name={name}
        id={name}
        value={value}
        oninput={OnInput}
        {...rest}
      />
      {hint ? <p class="hint">{hint}</p> : null}
    </div>
  )
}
