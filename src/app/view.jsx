import {h} from 'hyperapp'

// Import actions
import {ToggleMenu} from './actions'

// Import components
import {Html} from './theme/Html'
// import {TestPage} from './theme/TestPage'

import './app.css'

// Root view
export const view = state => (
  <Html state={state} menu-opened={state.menuOpened}>

    {/* <TestPage /> */}

    <aside class="left-menu">
      <header role="banner">
        <h2>Title</h2>
        <p>someusername</p>
      </header>
      <nav role="navigation">
        <ul>
          <li><a href="#">Link 1</a></li>
          <li><a href="#">Link 2</a></li>
          <li><a href="#">Link 3</a></li>
        </ul>
      </nav>
      <button onclick={ToggleMenu}>Toggle menu</button>
    </aside>
    <div class="menu-overlay" onclick={ToggleMenu}></div>

    <main class="main-content" role="main">

      <div class="topics">
        <h2>Main content</h2>
        <button onclick={ToggleMenu}>Toggle menu</button>
      </div>

      <div class="topic">
        <h2>Topic page</h2>
      </div>

    </main>

    {/* <header>
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
    </main> */}
  </Html>
)
