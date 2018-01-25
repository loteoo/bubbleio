
// Test data - user account
var user = {
  username: "loteoo",
  created: "2018-01-23 21:38:09"
}


// Test data - global view (bubble list)
var allBubbles = [
  {
    id: "csgo",
    name: "CS:GO",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    created: "2018-01-23 21:38:09"
  },
  {
    id: "potatoes",
    name: "Potato group",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    created: "2018-01-23 21:38:09"
  },
  {
    id: "webdev",
    name: "Web developpment",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    created: "2018-01-23 21:38:09"
  },
  {
    id: "testory",
    name: "Test bubble",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    created: "2018-01-23 21:38:09"
  }
]



// Test data - bubble view (thread list)
var bubble = {
  id: "testory",
  name: "Test bubble",
  desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  created: "2018-01-23 21:38:09",
  threads: [
    {
      id: 232,
      name: "My new car",
      score: 21,
      created: "2018-01-23 21:38:09",
      type: "image",
      content: {
        url: "https://i.redd.it/mcljmha8ufb01.jpg"
      }
    },
    {
      id: 232,
      name: "Hey watsup guys its the boi here",
      score: 25,
      created: "2018-01-23 21:38:09",
      type: "text",
      content: {
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      }
    },
    {
      id: 232,
      name: "Some youtube video",
      score: 12,
      created: "2018-01-23 21:38:09",
      type: "youtube",
      content: {
        youtubeId: "3BJU2drrtCM"
      }
    }
  ]
}



// Test data - thread view (message list)
var thread = {
  id: 232,
  name: "Hey watsup guys its the boi here",
  score: 25,
  type: "text",
  content: {
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  messages: [
    {
      sender: "loteoo",
      message: "Test message hello hello",
      created: "2018-01-23 21:38:09"
    },
    {
      sender: "asdasd",
      message: "message das das das dasd asd  hello",
      created: "2018-01-23 21:38:09"
    },
    {
      sender: "asdasd",
      message: "message das das das dasd asd  hello dasd asd  hello",
      created: "2018-01-23 21:38:09"
    },
    {
      sender: "loteoo",
      message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor inc",
      created: "2018-01-23 21:38:09"
    },
    {
      sender: "tototo",
      message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor inc",
      created: "2018-01-23 21:38:09"
    },
    {
      sender: "tototo",
      message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor inc",
      created: "2018-01-23 21:38:09"
    },
    {
      sender: "asdasd",
      message: "message das das das dasd asd  hello",
      created: "2018-01-23 21:38:09"
    },
    {
      sender: "loteoo",
      message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor inc",
      created: "2018-01-23 21:38:09"
    }
  ]
}
