import {h} from 'hyperapp'
import { Link, Route, Switch, Redirect, location } from "@hyperapp/router"

// import {Thread} from './Thread/Thread'

import './MainContainer.css'


export const MainContainer = () => (state, actions) => (
  <main class="main-container mdc-top-app-bar--fixed-adjust">
    <Switch>
      <Route path="/" render={NoBubbleChosen} />
      <Route path="/:bubbleName" render={Bubble} />
    </Switch>
  </main>
)




const NoBubbleChosen = ({match}) => (state, actions) =>
  <div>
    <h1>No bubble chosen</h1>
    <h2>Pick a bubble</h2>
    <button class="mdc-button" oncreate={el => el.ripple = new mdc.ripple.MDCRipple(el)}>
      Button
    </button>
    <div>
      Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
    </div>
  </div>


const Bubble = ({match}) => (state, actions) => {

  // Join room here
  socket.emit('switch bubble', {
    prevBubbleName: '',
    nextBubbleName: match.params.bubbleName
  });

  if (state.bubbles[match.params.bubbleName]) {
    let bubble = state.bubbles[match.params.bubbleName];
    return (
      <div key={bubble._id}>
        <h1>{bubble.title}</h1>
      </div>
    )
  } else {
    return (
      <div key={bubble._id}>
        <h2>Loading...</h2>
      </div>
    )
  }
}
