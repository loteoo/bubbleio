'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserBubbles = sequelize.define('UserBubbles', {
    userId: DataTypes.INTEGER,
    bubbleId: DataTypes.INTEGER
  }, {});
  UserBubbles.associate = function(models) {
    UserBubbles.belongsTo(models.User)
    UserBubbles.belongsTo(models.Bubble)
  };
  return UserBubbles;
};