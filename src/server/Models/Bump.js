import {User} from './User'
import {Thread} from './Thread'

export const Bump = sequelize.define('bump', {
  size: Sequelize.INTEGER
})

Bump.belongsTo(User)
Bump.belongsTo(Thread)
