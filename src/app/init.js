
// Initial state of the app
export const init = {

  location: {
    path: '/',
    bubbleName: null,
    threadId: null,
    lastBubbleName: null,
    lastThreadId: null
  },

  meta: {
    title: 'Bubbleio',
    description: 'Lorem ipraoum'
  },

  userId: null,

  menuOpened: true,

  menuBubbles: [],

  users: {},
  bubbles: {},
  threads: {},
  messages: {}
}
