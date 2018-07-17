import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"

import {Header} from './Header'
import {LeftSidebar} from './LeftSidebar'
import {MainContainer} from './MainContainer'

// Application root
export const view = (state, actions) => (
  <div class="app">
    <Header />
    <LeftSidebar />
    <MainContainer />
  </div>
)