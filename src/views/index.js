import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"

import {Header} from './Header/'
import {LeftSidebar} from './LeftSidebar/'

// Application root
export const view = (state, actions) => {

  // console.log(state);

  // If logged in
  if (state.user._id) {

    return (
      <main>
        <Header />
        <LeftSidebar />
        
      </main>
    )
  } else {
    return (
      <form class="loginForm">
        <h2>Pick a name</h2>
        <input type="text" placeholder="Type here..." name="username" minlength="3" maxlength="50" required autofocus />
      </form>
    )
  }
}
