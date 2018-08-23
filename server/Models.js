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
  userId:  {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  threads:  [{
    type: ObjectId,
    ref: 'Thread'
  }]
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
  bubbleId:  {
    type: ObjectId,
    ref: 'Bubble',
    required: true
  },
  userId:  {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  messages:  [{
    type: ObjectId,
    ref: 'Message'
  }]
}, {
  timestamps: true
});



// Message Schema
const messageSchema = new Schema({
  text:  {
    type: String,
    required: true
  },
  threadId:  {
    type: ObjectId,
    ref: 'Thread',
    required: true
  },
  userId:  {
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
    type: String
  },
  bubbleNames:  {
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
  messages:  [{
    type: ObjectId,
    ref: 'Message'
  }]
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
db.once('open', () => console.log('Connected to the database'));





module.exports = {
  Bubble,
  Thread,
  Message,
  User,
  ObjectId: mongoose.Types.ObjectId
}