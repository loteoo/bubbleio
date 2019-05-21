import { h } from 'hyperapp'

// Import actions
import { SetValue } from './actions'

const targetValue = event => event.target.value

const container = {
  maxWidth: '1024px',
  margin: '0 auto',
  padding: '1rem'
}

// Root view
export default state => (
  <main style={container}>
    <h1>{state.title}</h1>
    <p>{state.description}</p>
    <input
      type="text"
      value={state.title}
      oninput={[SetValue, ev => ({ key: 'title', value: targetValue(ev) })]}
    />
    <input
      type="text"
      value={state.description}
      oninput={[SetValue, ev => ({ key: 'description', value: targetValue(ev) })]}
    />
    <h4>State: </h4>
    <pre>{JSON.stringify(state, null, 2)}</pre>
  </main>
)
