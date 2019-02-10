import {h} from 'hyperapp'

// Import actions
import {ToggleMenu} from './actions'

import {Location} from '../utils'

// Import components
import {Html} from './theme/Html'
// import {TestPage} from './theme/TestPage'

import {Bubble} from './components/Bubble'
import {Thread} from './components/Thread'

import './app.css'

// Root view
export const view = state => (
  <Html
    meta={state.meta}
    menu-opened={state.menuOpened}
  >

    {/* <TestPage /> */}

    <aside class="left-menu">
      <header role="banner">
        <h2 class="username">{state.user ? state.user.name : 'Anonymous'}</h2>
        <p>{state.user && state.user.email}</p>
      </header>
      <nav role="navigation">
        <ul>
          {state.menuBubbles.map(name => {
            const bubble = state.bubbles[name]
            return (
              <li><a class={bubble.name === state.location.bubbleName ? 'active' : ''} onclick={(state) => [state, Location.go({to: '/' + bubble.name})]}>{bubble.title}</a></li>
            )
          })}
        </ul>
      </nav>
      <button onclick={ToggleMenu}>Toggle menu</button>
    </aside>
    <div class="menu-overlay" onclick={ToggleMenu}></div>



    <main class="main-content" role="main">

      <Bubble
        bubble={state.bubbles[state.location.bubbleName]}
        threads={state.threads}
      />

      <Thread
        thread={state.threads[state.location.threadId]}
        messages={state.messages}
        messageForm={state.messageForm}
        pickNameForm={state.pickNameForm}
        user={state.user}
      />

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
