import {h} from 'hyperapp'
import { Link, Route, Switch, Redirect, location } from "@hyperapp/router"

import {NoBubbleChosen} from '../NoBubbleChosen'
import {NewBubbleForm} from '../NewBubbleForm'
import {Bubble} from '../Bubble'
// import {Thread} from './Thread/Thread'




export const MainContainer = () => (state, actions) => (
  <main class="main-container">
    <Switch>
      <Route path="/" render={NoBubbleChosen} />
      <Route path="/new-bubble" render={NewBubbleForm} />
      <Route path="/:bubbleName" render={Bubble} />
    </Switch>
  </main>
)
