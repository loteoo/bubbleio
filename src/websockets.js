import Sequelize from 'sequelize'



const sequelize = new Sequelize('bubbleio', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
})



const User = sequelize.define('user', {
  name: Sequelize.STRING,
  password: Sequelize.STRING
})


const Bubble = sequelize.define('bubble', {
  name: Sequelize.STRING,
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  public: Sequelize.BOOLEAN,
  default: Sequelize.BOOLEAN
})
Bubble.belongsTo(User)




const Thread = sequelize.define('thread', {
  title: Sequelize.STRING,
  type: Sequelize.STRING,
  link: Sequelize.STRING,
  image: Sequelize.STRING,
  text: Sequelize.TEXT
})
Thread.belongsTo(User)
Thread.belongsTo(Bubble)


const Bump = sequelize.define('bump', {
  size: Sequelize.INTEGER
})
Bump.belongsTo(User)
Bump.belongsTo(Thread)



const Message = sequelize.define('message', {
  text: Sequelize.STRING
})
Message.belongsTo(User)
Message.belongsTo(Thread)






sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
    User.create({
      name: 'Username',
      password: 'password'
    })

  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

