import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"


import {LeftMenu} from './layout/LeftMenu/LeftMenu'
import {MainContainer} from './layout/MainContainer/MainContainer'

// Bundle css
import './global.css'

// Application root
export const view = (state, actions) => {
  console.log(state);
  
  return (
    <div class="app">
      <LeftMenu />
      <MainContainer />
    </div>
  )
}
