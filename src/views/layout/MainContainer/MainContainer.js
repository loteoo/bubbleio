import {h} from 'hyperapp'
import { Link, Route, Switch, Redirect, location } from "@hyperapp/router"

import {Home} from '../../components/Home/Home.js'
import {FourOFour} from '../../components/FourOFour/FourOFour.js'
import {BubbleLoader} from '../../components/BubbleLoader/BubbleLoader.js'


import './main-container.css'

export const MainContainer = () => (state, actions) => (
  <main class="main-container">
    <BubbleLoader />
  </main>
)
