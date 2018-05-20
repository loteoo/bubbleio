import {h} from 'hyperapp'
import { Link, Route, Switch, Redirect, location } from "@hyperapp/router"

import {NoBubbleChosen} from '../NoBubbleChosen/NoBubbleChosen'
import {NewBubbleForm} from '../NewBubbleForm/NewBubbleForm'
import {Bubble} from '../Bubble/Bubble'
// import {Thread} from './Thread/Thread'

import './MainContainer.css'


export const MainContainer = () => (state, actions) => (
  <main class="main-container mdc-top-app-bar--fixed-adjust">
    <Switch>
      <Route path="/" render={NoBubbleChosen} />
      <Route path="/new-bubble" render={NewBubbleForm} />
      <Route path="/:bubbleName" render={Bubble} />
    </Switch>
  </main>
)
