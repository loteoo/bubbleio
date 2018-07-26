import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"


import {LeftMenu} from './layout/LeftMenu/LeftMenu'
import {MainContainer} from './layout/MainContainer/MainContainer'
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
      <div class="layout">
        <LeftMenu />
        <MainContainer />
        <RightPanel />
      </div>
      <LoginForm {...state.loginForm}/>
    </div>
  )
}
