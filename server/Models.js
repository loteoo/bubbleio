// =================
// Mongoose models
// =================

// Dependencies
const mongoose = require('mongoose');
const {Schema, connection: db} = mongoose;
const {ObjectId} = Schema.Types;



// Bubble Schema
const bubbleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  title:  {
    type: String,
    required: true
  },
  description:  {
    type: String,
    required: true
  },
  public:  {
    type: Boolean,
    default: true,
    required: true
  },
  default:  {
    type: Boolean,
    default: false,
    required: true
  },
  trashed:  {
    type: Boolean,
    default: false,
    required: true
  },
  threads:  [{
    type: ObjectId,
    ref: 'Thread'
  }],
  user:  {
    type: ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});





// Thread Schema
const threadSchema = new Schema({
  title:  {
    type: String,
    required: true
  },
  score:  {
    type: Number,
    default: 0,
    required: true
  },
  type:  {
    type: String,
    default: 'default',
    required: true
  },
  trashed:  {
    type: Boolean,
    default: false,
    required: true
  },
  messages:  [{
    type: ObjectId,
    ref: 'Message'
  }],
  bubble:  {
    type: ObjectId,
    ref: 'Bubble',
    required: true
  },
  user:  {
    type: ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});



// Message Schema
const messageSchema = new Schema({
  message:  {
    type: String,
    required: true
  },
  thread:  {
    type: ObjectId,
    ref: 'Thread',
    required: true
  },
  user:  {
    type: ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});



// User Schema
const userSchema = new Schema({
  username:  {
    type: String,
    required: true
  },
  password:  {
    type: String,
    required: true
  },
  bubblesIds:  {
    type: Array,
    default: [],
    required: true
  },
  threads:  [{
    type: ObjectId,
    ref: 'Thread'
  }],
  createdBubbles:  [{
    type: ObjectId,
    ref: 'Bubble'
  }],
}, {
  timestamps: true
});




// Create our models using the schemas
const Bubble = mongoose.model('Bubble', bubbleSchema);
const Thread = mongoose.model('Thread', threadSchema);
const Message = mongoose.model('Message', messageSchema);
const User = mongoose.model('User', userSchema);




// Connect to Database
mongoose.connect('mongodb://localhost:27017/bubbleio');

db.on('error', console.error.bind(console, 'Database connection error:'));
db.once('open', () => {

  
  console.log('Connected to the database')







  // Initialize some data if this is a new database

  // Init user
  User.findOne({username: 'loteoo'}, (err, user) => {
    if (err) return handleError(err);
    if (!user) {
      let user = new User({
        username: 'loteoo',
        password: 'testtest'
      });
      user.save((err, User) => {
        if (err) return handleError(err);
        console.log('Created user ' + user.username);

        // Init bubble
        Bubble.findOne({name: 'general'}, (err, bubble) => {
          if (err) return handleError(err);
          if (!bubble) {
            let bubble = new Bubble({
              name: 'general',
              title: 'General',
              description: 'A bubble for everyone!',
              public: true,
              default: true,
              user: user._id
            });
          
            bubble.save((err, bubble) => {
              
              console.log('Created bubble ' + bubble.name);
            });
          }
        });
      });
    }
  });


  
  // Bubble.findOne({name: 'general'}).populate('user').exec((err, bubble) => {
  //   console.log(bubble);
  // });

  // User.findOne({username: 'loteoo'}).populate('createdBubbles').exec((err, user) => {
  //   console.log(user);
  // });

});





module.exports = {
  Bubble,
  Thread,
  Message,
  User
}