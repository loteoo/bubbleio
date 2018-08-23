import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"


import {LeftMenu} from './layout/LeftMenu/LeftMenu'
import {BubbleView} from './components/BubbleView/BubbleView'
import {RightPanel} from './layout/RightPanel/RightPanel'

import {LoginForm} from './components/LoginForm/LoginForm'

// Bundle css
import 'sanitize.css'
import './global.css'

// Application root
export const view = (state, actions) => {
  console.log(state);
  return (
    <div class="app">
      <LeftMenu />
      <BubbleView />
      <RightPanel />
    </div>
  )
}
