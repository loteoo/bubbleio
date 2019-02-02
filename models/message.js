'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    text: DataTypes.STRING
  }, {});
  Message.associate = function(models) {
    Message.belongsTo(models.User)
    Message.belongsTo(models.Thread)
  };
  return Message;
};