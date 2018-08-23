import {h} from 'hyperapp'
import { Link, Route, Switch, Redirect, location } from "@hyperapp/router"

import {Home} from '../../components/Home/Home.js'
import {FourOFour} from '../../components/FourOFour/FourOFour.js'
import {BubbleView} from '../../components/BubbleView/BubbleView.js'


import './main-view.css'

export const MainView = () => (state, actions) => (
  <main class="main-view">
    <BubbleView />
  </main>
)
