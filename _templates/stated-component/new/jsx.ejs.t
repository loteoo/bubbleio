---
to: src/views/<%= h.inflection.camelize(name.replace(/\s/g, '_')) %>/<%= h.inflection.camelize(name.replace(/\s/g, '_')) %>.js
---
import {h} from 'hyperapp'

import './<%= h.inflection.dasherize(name.toLowerCase()) %>.css'

// Namespaced setter action
const set = fragment => main.update({<%= h.inflection.camelize(name.replace(/\s/g, '_'), true) %>: fragment})

export const <%= h.inflection.camelize(name.replace(/\s/g, '_')) %> = ({count = count || 0}) => (state, actions) => (
  <div class="<%= h.inflection.dasherize(name.toLowerCase()) %>" key="<%= h.inflection.dasherize(name.toLowerCase()) %>">
    <p>Component with namespaced state within the global state</p>
    <h2>{count}</h2>
    <button onclick={ev => set({count: count - 1})}>-</button>
    <button onclick={ev => set({count: count + 1})}>+</button>
  </div>
)

// import {<%= h.inflection.camelize(name.replace(/\s/g, '_')) %>} from './<%= h.inflection.camelize(name.replace(/\s/g, '_')) %>/<%= h.inflection.camelize(name.replace(/\s/g, '_')) %>.js'
// <<%= h.inflection.camelize(name.replace(/\s/g, '_')) %> {...state.<%= h.inflection.camelize(name.replace(/\s/g, '_'), true) %>} />
