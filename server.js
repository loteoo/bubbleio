'use stric';

// ===============
// HTTP server
// ===============
const app = require('./server/Http.js');

















// =================
// Mongo DB
// =================
const {Bubble, Thread, Message, User, ObjectId} = require('./server/Models.js');













// =================
// Seed database
// =================


const faker = require('faker');





// Initialize some data if this is a new database

// Init user
User.findOne({username: 'loteoo'}, (err, user) => {
  if (err) throw err;
  if (!user) {
    let user = new User({
      username: 'loteoo',
      password: 'testtest'
    });
    user.save((err, user) => {
      if (err) throw err;
      console.log('Created user ' + user.username);

      // Init bubble
      let bubble = new Bubble({
        name: 'general',
        title: 'General',
        description: 'A bubble for everyone!',
        public: true,
        default: true,
        userId: user._id
      });
    
      bubble.save((err, bubble) => {
        console.log('Created bubble ' + bubble.name)



        for (let i = 0; i < 15; i++) {
          new Thread({
            title: faker.name.title(),
            score: 0,
            type: 'text',
            trashed: false,
            userId: user._id,
            bubbleId: bubble._id
          }).save((err, thread) => {
            console.log('Thread ' + thread.title + ' created')

            
            for (let j = 0; j < 15; j++) {
              new Message({
                userId: user._id,
                threadId: thread._id,
                text: faker.lorem.text()
              }).save((err, message) => {
                console.log('Message generated');
              });
            }

          });
        }
      });
    });
  }
});

  

















// ===============
// Websockets
// ===============


// Dependencies
const io = require('socket.io')(app);
const {map: pmap} = require('p-iteration');

// Returns number of sockets connections currently in the specified room
const getConnectionsInRoom = roomName => {
  let room = [];
  let allSockets = Object.keys(io.sockets.sockets);
  for (let i = 0; i < allSockets.length; i++) {
    let roomsOfSocket = Object.keys(io.sockets.adapter.sids[allSockets[i]]);
    for (let j = 0; j < roomsOfSocket.length; j++) {
      if (roomsOfSocket[j] == roomName) {
        room.push(allSockets[i]);
      }
    }
  }
  return room.length;
}





// Takes in an array of objects and returns a single object
// with each object indexed as a property by their unique names
const getIndexedBubbles = bubbles => {
  let indexedBubbles = {};
  for (let i = 0; i < bubbles.length; i++) {
    indexedBubbles[bubbles[i].name] = bubbles[i].toObject();
    indexedBubbles[bubbles[i].name].userCount = getConnectionsInRoom(bubbles[i].name);
  }
  return indexedBubbles;
}





// Takes in an array of objects and returns a single object
// with each object indexed as a property by their unique names
const getIndexedThreads = threads => {
  let indexedThreads = {};
  


  let decoratedThreads = pmap(threads, async thread => {
    let decorated = thread.toObject();
    decorated.userCount = getConnectionsInRoom(thread._id);
    decorated.messageCount = await Message.countDocuments({threadId: thread._id});
  });

  
  for (let i = 0; i < decoratedThreads.length; i++) {
    indexedThreads[decoratedThreads[i]._id] = decoratedThreads[i];
  }

  return indexedThreads;
}





// Takes in an array of objects and returns a single object
// with each object indexed as a property by their unique names
const getIndexedMessages = collection => {
  let indexedCollection = {};
  for (let i = 0; i < collection.length; i++) {
    indexedCollection[collection[i]._id] = collection[i].toObject();
  }
  return indexedCollection;
}






// Update clients who have that this bubble in their user's bubble list
// (joined in the room or not)
const emitBubbleUserCounts = (bubbleName, socket) => {

  let newState = {
    bubbles: {
      [bubbleName]: {
        userCount: getConnectionsInRoom(bubbleName)
      }
    }
  };

  // Emit to this connection, logged in or not
  socket.emit('update state', newState);

  // Find users who have this bubble in their list AND and logged in, 
  // but not necessarly in the bubble
  User.find({ bubbleNames: bubbleName }, (err, users) => {
    if (err) throw err;

    for (socketId in io.sockets.sockets) {
      users.forEach(user => {
        if (io.sockets.sockets[socketId].userId) {
          if (io.sockets.sockets[socketId].userId.toString() == user._id.toString()) {
            console.log('BUBLE USER COUNT');
            io.sockets.sockets[socketId].emit('update state', newState);
          }
        }
      });
    }
  });
}





// ================================
// Manage events
// ================================


io.on('connection', socket => {



  // ==============================================
  // Get the default bubbles on login, for anyone
  // ==============================================

  Bubble.find({default: true}, (err, bubbles) => {
    if (err) throw err;

    // Update the client
    socket.emit('update state', {
      bubbles: getIndexedBubbles(bubbles)
    });
    console.log('New connection');
    
  });



  

  // ==============================================
  // Handle bubble navigation
  // ==============================================
  socket.on('switch bubble', ({prevBubbleName, nextBubbleName}) => {

    // If user was in an other room before this
    if (prevBubbleName) {
      // Leave connection to the previous room
      socket.leave(prevBubbleName);
      emitBubbleUserCounts(prevBubbleName, socket);
      console.log(`${socket.userId ? 'User #' + socket.userId : 'Anonymous'} left bubble ${prevBubbleName}`);
    }

    // Fetch, join and update clients
    Bubble.findOne({name: nextBubbleName, trashed: false}, (err, bubble) => {
      if (err) throw err;
      if (bubble) {
        // TODO: Only load user messages count, not the entire message list
        Thread.find({bubbleId: bubble._id}, (err, threads) => {
          if (err) throw err;

          // Add this bubble to the user's bubble list
          User.findByIdAndUpdate(socket.userId, {$addToSet: {bubbleNames: bubble.name}}, (err, user) => {
            if (err) throw err;

            // Join connection to the new room
            socket.join(bubble.name);

            // Update clients about new user
            emitBubbleUserCounts(bubble.name, socket);            

            // Use this occasion to send threads to the user
            socket.emit('update state', {
              user,
              bubbles: {
                [bubble.name]: bubble
              },
              threads: getIndexedThreads(threads),
              prevBubbleName: bubble.name
            });
            console.log(`${socket.userId ? user.username : 'Anonymous'} joined bubble ${bubble.name} (${bubble.title})`);
          });
        });
      }
    });
  });


  




  // ==============================================
  // Handle thread navigation
  // ==============================================

  socket.on('switch thread', ({prevThreadId, nextThreadId}) => {

    // If user was in an other thread before this
    if (prevThreadId) {

      // Leave connection to the new room
      socket.leave(prevThreadId);

      Thread.findById(prevThreadId, (err, thread) => {
        if (err) throw err;
        if (thread) { // If thread actually exists
          
          Bubble.findById(thread.bubbleId, (err, bubble) => {
            if (err) throw err;
            // Update clients in the previous thread's bubble
            io.to(bubble.name).emit('update state', {
              threads: {
                [thread._id]: {
                  userCount: getConnectionsInRoom(thread._id)
                }
              }
            });
            console.log(`${socket.userId || 'Anonymous'} left thread #${thread._id} (${thread.title})`);
          });
        }
      });
    }


    Thread.findById(nextThreadId, (err, thread) => {
      if (err) throw err;
      if (thread) { // If thread actually exists
        
        Message.find({ threadId: ObjectId(thread._id) }, (err, messages) => {
          if (err) throw err;

          Bubble.findById(thread.bubbleId, (err, bubble) => {
            if (err) throw err;
            // Join connection to the new room
            socket.join(thread._id);

            // Update clients in the thread's bubble (user counts only)
            socket.broadcast.to(bubble.name).emit('update state', {
              threads: {
                [thread._id]: {
                  userCount: getConnectionsInRoom(thread._id)
                }
              }
            });

            // Update user count and messages from the DB for the switching client
            socket.emit('update state', {
              threads: {
                [thread._id]: {
                  userCount: getConnectionsInRoom(thread._id)
                }
              },
              messages: getIndexedMessages(messages),
              prevThreadId: thread._id
            });
            console.log(`${socket.userId || 'Anonymous'} joined thread #${thread._id} (${thread.title})`);
          });
        });
      }
    });
  });








  // ==============================================
  // New thread
  // ==============================================

  socket.on('new thread', ({title, score, type, trashed, userId, bubbleId}) => {

    let thread = new Thread({title, score, type, trashed, userId, bubbleId});
    
    // Update DB
    thread.save((err, thread) => {
      if (err) throw err;
      
      Bubble.findById(thread.bubbleId, (err, bubble) => {

        // Update clients in the bubble
        io.in(bubble.name).emit('update state', {
          threads: {
            [thread._id]: thread
          }
        });
        console.log(`User #${socket.userId} created thread #${thread._id} (${thread.title})`);
      });
    });
  });




  



  // ==============================================
  // Upvote thread
  // ==============================================

  socket.on('vote', ({threadId, quantity}) => {

    // Update DB
    Thread.findByIdAndUpdate(threadId, {$inc : {score: quantity}}, (err, thread) => {
      if (err) throw err;
      Bubble.findById(thread.bubbleId, (err, bubble) => {
        if (err) throw err;
        
        // Update clients in the bubble
        io.in(bubble.name).emit('update state', {
          threads: {
            [thread._id]: thread
          }
        });
        console.log(`User #${socket.userId} upvoted thread #${thread._id} (${thread.title}) by ${quantity} points. New score: ${thread.score}`);
      });
    });
  });










  // ==============================================
  // New message
  // ==============================================
  socket.on('new message', ({userId, threadId, text}) => {

    let message = new Message({userId, threadId, text});

    // Save message
    message.save((err, message) => {
      if (err) throw err;


      Thread.findById(message.threadId, (err, thread) => {
        if (err) throw err;
        Bubble.findById(thread.bubbleId, (err, bubble) => {
          if (err) throw err;
          Message.countDocuments({threadId: message.threadId}, (err, count) => {
            if (err) throw err;
              
            // Update all clients in the thread
            io.in(message.threadId).emit('update state', {
              messages: {
                [message._id]: message
              },
              threads: {
                [thread._id]: {
                  messageCount: count
                }
              }
            });

            // Update all message count in bubble
            socket.broadcast.to(bubble.name).emit('update state', {
              threads: {
                [thread._id]: {
                  messageCount: count
                }
              }
            });
            console.log(`User #${socket.userId} sent a message in thread #${thread._id} (${thread.title}). Message: ${text}`);
          });
        });
      });
    });
  });











  // ==============================================
  // Login form
  // ==============================================
  socket.on('login', ({username, password, mode}) => {

    console.log(`Login attempt: ${username}`);

    User.findOne({username}, (err, user) => {
      if (err) throw err;

      // If this is a new user
      if (!user) {

        // Get the default bubbles
        Bubble.find({default: true}, (err, bubbles) => {
          if (err) throw err;

          // Give the user the default bubbles
          let user = new User({
            username,
            password,
            bubbleNames: bubbles.map(bubble => bubble.name)
          });
          
          user.save((err, user) => {
            if (err) throw err;

            // Link the user ID to the socket connection
            socket.userId = user._id;

            // Update the client
            socket.emit('update state', {
              user,
              bubbles: getIndexedBubbles(bubbles)
            });
          });
          console.log(`Created user ${username}. (#${user._id})`);

        });
      } else {

        // Add the user ID to the socket connection
        socket.userId = user._id;

        // Send him his bubbles
        Bubble.find({name: { $in: user.bubbleNames }, trashed: false}, (err, bubbles) => {
          if (err) throw err;

          // Update user bubbles
          socket.emit('update state', {
            user,
            bubbles: getIndexedBubbles(bubbles)
          });
          console.log(`User ${username} logged in. (#${user._id})`);
        });
      }
    });
  });







  // ==============================================
  // New bubble
  // ==============================================
  socket.on('new bubble', ({name, title}) => {

    // Check if bubble name is already taken
    Bubble.findOne({name, trashed: false}, (err, bubble) => {
      if (err) throw err;
      if (bubble) { // If bubble already exists
        socket.emit('update state', {
          bubbleForm: {
            error: 'nameTaken'
          }
        });
      } else {

        let bubble = new Bubble({name, title});

        bubble.save((err, bubble) => {
          if (err) throw err;

          // Add this bubble to the user's bubble list
          User.findByIdAndUpdate(socket.userId, {$addToSet: {bubbleNames: bubble.name}}, (err, user) => {
            if (err) throw err;

            // Update user bubbles
            socket.emit('update state', {
              user: user.value,
              bubbles: {
                [bubble.name]: bubble
              }
            });
            console.log(`User #${socket.userId} created new bubble ${name} (${title})`);
          });
        });
      }
    });
  });








  // Redirect to random public bubble
  socket.on('random bubble', () => {
    Bubble.find({visibility: 'public', trashed: false}, null, {skip: Math.floor(Math.random()*Bubble.estimatedDocumentCount())})
    .limit(1, (err, bubbles) => {
      if (err) throw err;
      if (bubbles && bubbles[0]) {
        socket.emit('redirect', '/' + bubbles[0].name);
      }
    });
  });






  // // Pass all received message to all clients
  // socket.on('update user', user => {


  //   let tempID = user._id;

  //   delete user._id;

  //   // Update DB
  //   User.findOneAndUpdate({
  //     _id: ObjectId(tempID)
  //   }, {
  //     $set: user
  //   }, { returnOriginal: false }, (err, result) => {
  //     if (err) throw err;
  //   });
  // });



});





console.log('Server started!');
