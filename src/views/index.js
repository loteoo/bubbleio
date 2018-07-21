import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"


import {LeftMenu} from './layout/LeftMenu/LeftMenu'
import {MainContainer} from './layout/MainContainer/MainContainer'
import {RightPanel} from './layout/RightPanel/RightPanel'

// Bundle css
import './global.css'

// Application root
export const view = (state, actions) => {
  console.log(state);
  
  return (
    <div class="app">
      <LeftMenu />
      <MainContainer />
      <RightPanel />
    </div>
  )
}
