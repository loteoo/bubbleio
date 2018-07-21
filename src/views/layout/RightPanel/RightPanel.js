
import {h} from 'hyperapp'
import { Link, Route, Switch, Redirect, location } from "@hyperapp/router"

import {Home} from '../../components/Home/Home.js'
import {FourOFour} from '../../components/FourOFour/FourOFour.js'
import {ThreadLoader} from '../../components/ThreadLoader/ThreadLoader.js'

import './right-panel.css'

export const RightPanel = () => (
  <div class="right-panel">
    <Switch>
      <Route path="/:bubbleName" render={Home} />
      <Route parent path="/:bubbleName/:threadId" render={ThreadLoader} />
      <Route render={FourOFour} />
    </Switch>
  </div>
)