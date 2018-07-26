---
to: src/views/<%= h.inflection.camelize(name.replace(/\s/g, '_')) %>/<%= h.inflection.camelize(name.replace(/\s/g, '_')) %>.js
---
import {h} from 'hyperapp'

import './<%= h.inflection.dasherize(name.toLowerCase()) %>.css'

// Namespaced setter action
const set = fragment => main.update({<%= h.inflection.camelize(name.replace(/\s/g, '_'), true) %>: fragment})

// Handle form submittion
const handleSubmit = ev => (state, actions) => {
  ev.preventDefault();

  alert('Submitted!\nForm state: \n\n' + JSON.stringify(state.<%= h.inflection.camelize(name.replace(/\s/g, '_'), true) %>, null, 2));
}

export const <%= h.inflection.camelize(name.replace(/\s/g, '_')) %> = ({firstName, lastName}) => (state, actions) => (
  <form class="<%= h.inflection.dasherize(name.toLowerCase()) %>" key="<%= h.inflection.dasherize(name.toLowerCase()) %>" method="post" onsubmit={ev => handleSubmit(ev)(state, actions)}>
    <h2>Form component with namespaced state</h2>
    <p>Full name: <b>{firstName} {lastName}</b></p>
    <input type="text" name="firstName" placeholder="First name" value={firstName} oninput={ev => set({firstName: ev.target.value})} required /><br/>
    <input type="text" name="lastName" placeholder="Last name" value={lastName} oninput={ev => set({lastName: ev.target.value})} required /><br/>
    <button type="submit">Submit</button>
  </form>
)

// import {<%= h.inflection.camelize(name.replace(/\s/g, '_')) %>} from './<%= h.inflection.camelize(name.replace(/\s/g, '_')) %>/<%= h.inflection.camelize(name.replace(/\s/g, '_')) %>.js'
// <<%= h.inflection.camelize(name.replace(/\s/g, '_')) %> {...state.<%= h.inflection.camelize(name.replace(/\s/g, '_'), true) %>} />
