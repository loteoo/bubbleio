
// Test data - user account
var user = {
  usertitle: "loteoo",
  created: "2018-01-23 21:38:09"
}


// Test data - global view (bubble list)
var allBubbles = [
  {
    id: 1,
    name: "csgo",
    title: "CS:GO",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    created: "2018-01-23 21:38:09"
  },
  {
    id: 2,
    name: "potatoes",
    title: "Potato group",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    created: "2018-01-23 21:38:09"
  },
  {
    id: 3,
    name: "webdev",
    title: "Web developpment",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    created: "2018-01-23 21:38:09"
  },
  {
    id: 4,
    name: "testory",
    title: "Test bubble",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    created: "2018-01-23 21:38:09"
  }
]



// Test data - bubble view (thread list)
var bubble = {
  id: 5,
  name: "testory",
  title: "Test bubble",
  desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  created: "2018-01-23 21:38:09",
  threads: [
    {
      id: 232,
      title: "My new car",
      score: 21,
      created: "2018-01-23 21:38:09",
      author: "pkasdasdl",
      type: "image",
      content: {
        url: "https://i.redd.it/mcljmha8ufb01.jpg"
      }
    },
    {
      id: 234,
      title: "Hey watsup guys its the boi here",
      score: 25,
      created: "2018-01-23 21:38:09",
      author: "ahkdklas",
      type: "text",
      content: {
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      }
    },
    {
      id: 236,
      title: "Some youtube video",
      score: 12,
      created: "2018-01-23 21:38:09",
      author: "fulsfojisdf",
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
  title: "Hey watsup guys its the boi here",
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
