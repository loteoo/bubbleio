import {h} from 'hyperapp'
import cc from 'classcat'

import './nice-input.css'

export const NiceInput = (props, children, {label = label || 'Label', name = name || 'name', type = type || 'text', placeholder = placeholder || ' ', setter} = props) => (
  <div class={cc(['nice-input', name])} key={name}>
    <input type={type} name={name} id={name} placeholder={placeholder} oninput={ev => setter({[name]: ev.target.value})} {...props} setter={null} />
    <label for={name}>{label}</label>
  </div>
)

// import {NiceInput} from './NiceInput/NiceInput.js'
// <NiceInput label="First name" name="first_name" setter={set} />
