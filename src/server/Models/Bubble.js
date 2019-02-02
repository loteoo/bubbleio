
import {User} from './User'

export const Bubble = sequelize.define('bubble', {
  name: Sequelize.STRING,
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  public: Sequelize.BOOLEAN,
  default: Sequelize.BOOLEAN
})

Bubble.belongsTo(User)
