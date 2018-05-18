import {location} from "@hyperapp/router"
import {ObjectID} from '../utils/'


export const actions = {
  location: location.actions,
  handleLoginForm: ev => state => {
    ev.preventDefault();

    console.log(ev);

  }
}
