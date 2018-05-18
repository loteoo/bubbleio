import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"

import {Header} from './Header/Header'
import {LeftSidebar} from './LeftSidebar/LeftSidebar'
import {MainContainer} from './MainContainer/MainContainer'
import {LoginForm} from './LoginForm/LoginForm'

// Application root
export const view = (state, actions) => {

  // console.log(state);

  // If logged in
  if (false) {

    return (
      <div>
        <Header />
        <LeftSidebar />
        <MainContainer />
      </div>
    )
  } else {
    return <LoginForm />
  }
}
