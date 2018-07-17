import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"

import {Header} from './Header'
import {OffCanvas} from './OffCanvas'
import {MainContainer} from './MainContainer'

// Application root
export const view = (state, actions) => {
  console.log(state);
  
  return (
    <div class="app">
      <Header />
      <OffCanvas />
      <MainContainer />
    </div>
  )
}