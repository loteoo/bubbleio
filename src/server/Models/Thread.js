import {User} from './User'
import {Bubble} from './Bubble'

export const Thread = sequelize.define('thread', {
  title: Sequelize.STRING,
  type: Sequelize.STRING,
  link: Sequelize.STRING,
  image: Sequelize.STRING,
  text: Sequelize.TEXT
})

Thread.belongsTo(User)
Thread.belongsTo(Bubble)
