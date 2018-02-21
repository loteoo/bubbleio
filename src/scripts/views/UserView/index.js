import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"



export const UserView = ({state, actions}) => (
  h("div", { class: "global-view" }, [
    h("div", { class: "frame" }, [
      h("h2", {}, state.user.username),
      h("ul", { class: "bubbles" }, [
        state.bubbles.map(bubbleItem),
        h("li", {}, [
          h("span", {}, "Create bubble")
        ])
      ])
    ])
  ])
)


const bubbleItem = (bubble) => {
  let userCountTxt = "";
  if (bubble.userCount) {
    userCountTxt = " (" + bubble.userCount + ")";
  }
  return h("li", {}, [
    Link({ to: "/" + bubble.name }, bubble.title + userCountTxt)
  ])
}
