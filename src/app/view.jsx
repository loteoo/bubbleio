import {h} from 'hyperapp'

// Import actions
import {SetValue} from './actions'

// Import components
import {Html} from './theme/Html'

// Root view
export const view = state => (
  <Html state={state}>
    <header>
      <div class="container">
        <h1>{state.title}</h1>
        <p>{state.description}</p>
      </div>
    </header>
    <main>
      <div class="container">
        <input type="text" value={state.title} oninput={[SetValue, 'title']} />
        <input type="text" value={state.description} oninput={[SetValue, 'description']} />
      </div>
      <div class="container">
        <h4>App state: </h4>
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </div>
    </main>
  </Html>
)
