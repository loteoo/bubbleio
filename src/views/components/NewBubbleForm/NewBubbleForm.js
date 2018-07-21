import {h} from 'hyperapp'


const handleNewBubbleForm = ev => state => {
  ev.preventDefault();

  socket.emit('new bubble', {
    title: ev.target.title.value,
    name: ev.target.name.value,
    description: ev.target.description.value,
    visibility: ev.target.visibility.value,
    author: state.user.username,
    created: new Date().getTime()
  });
}

export const NewBubbleForm = () => (state, actions) =>
  <form class="new-bubble-form" method="post" onsubmit={handleNewBubbleForm}>
    <h2>Let's create a brand new bubble.</h2>
    <p>A welcoming home for a community of any common interest</p>


  </form>
