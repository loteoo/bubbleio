import {h} from 'hyperapp'


// Import components
import {Html} from './theme/Html'


import './app.css'

// import {TestPage} from './theme/TestPage'

import {BubbleLoader} from './components/Bubble'
import {ThreadLoader} from './components/Thread'

import {LeftMenu} from './components/LeftMenu'

// Root view
export const view = state => (
  <Html
    meta={state.meta}
    menu-opened={state.menuOpened}
  >

    {/* <TestPage /> */}


    <LeftMenu state={state} />


    <main class="main-content" role="main">
      {state.location.bubbleName && (
        <BubbleLoader bubbles={state.bubbles} bubbleName={state.location.bubbleName} />
      )}
      {state.location.threadId && (
        <ThreadLoader
          threads={state.threads}
          threadId={state.location.threadId}
          messageForm={state.messageForm}
          pickNameForm={state.pickNameForm}
          user={state.user}
        />
      )}
    </main>

  </Html>
)
