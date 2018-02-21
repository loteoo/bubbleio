import {h} from 'hyperapp'
import {Link} from "@hyperapp/router"
import {Keyboard} from '../Keyboard/'

import {Thread} from './Thread/'


export const CurrentBubble = ({currentBubble, state, actions}) => {
  if (currentBubble) {

    if (!currentBubble.title) {
      currentBubble.title = "Loading...";
    }

    let userCountTxt = "";
    if (currentBubble.userCount) {
      userCountTxt = " (" + currentBubble.userCount + ")";
    }

    return h("div", { class: "bubble-view", name: currentBubble.name, onupdate: (el, oldProps) => {
      if (oldProps.name != currentBubble.name) {
        // User switched bubbles
        socket.emit('switch bubble', {
          prevBubbleName: oldProps.name,
          nextBubbleName: currentBubble.name
        });
        console.log("--> join bubble: " + currentBubble.name);
      }
    }, oncreate: el => {
      socket.emit('switch bubble', {
        nextBubbleName: currentBubble.name
      });
      console.log("--> join bubble: " + currentBubble.name);
    } }, [
      h("div", { class: "frame", onscroll: (ev) => { if (isElementInViewport(ev.target.lastChild)) {  console.log("Load more not working yet"); } } }, [
        h("div", { class: "bubble-header" }, [
          Link({ to: "/" + name, class: "back" }),
          h("h2", {}, currentBubble.title + userCountTxt),
          h("div", { class: "options" }, [
            h("button", { onclick: ev => {
              if (ev.target.nextSibling.classList.contains("opened")) {
                ev.target.nextSibling.classList.remove("opened")
              } else {
                ev.target.nextSibling.classList.add("opened")
              }
            } }),
            h("ul", {}, [
              h("li", {}, h("span", {}, "Leave bubble"))
            ])
          ])
        ]),
        h("ul", { class: "threads" }, currentBubble.threads.map(thread => Thread(thread, currentBubble, actions))),
        Keyboard(state, actions),
        h("div", { class: "loadMore" })
      ])
    ])
  }
}
