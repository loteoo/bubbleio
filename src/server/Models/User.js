export const User = sequelize.define('user', {
  name: Sequelize.STRING,
  password: Sequelize.STRING
})
