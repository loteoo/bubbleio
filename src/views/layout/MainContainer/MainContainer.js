import {h} from 'hyperapp'
import { Link, Route, Switch, Redirect, location } from "@hyperapp/router"

import {Home} from '../../components/Home/Home.js'
import {FourOFour} from '../../components/FourOFour/FourOFour.js'
import {BubbleLoader} from '../../components/BubbleLoader/BubbleLoader.js'


import './main-container.css'

export const MainContainer = () => (state, actions) => (
  <main class="main-container">
    <Switch>
      <Route path="/" render={Home} />
      <Route parent path="/:bubbleName" render={BubbleLoader} />
      <Route render={FourOFour} />
    </Switch>
  </main>
)
