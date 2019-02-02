import {User} from './User'
import {Thread} from './Thread'

export const Message = sequelize.define('message', {
  text: Sequelize.STRING
})

Message.belongsTo(User)
Message.belongsTo(Thread)
