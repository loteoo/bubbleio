'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserBubble = sequelize.define('UserBubble', {
  }, {});
  UserBubble.associate = function(models) {
    UserBubble.belongsTo(models.User)
    UserBubble.belongsTo(models.Bubble)
  };
  return UserBubble;
};