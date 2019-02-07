'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bubble = sequelize.define('Bubble', {
    name: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    public: DataTypes.BOOLEAN,
    default: DataTypes.BOOLEAN
  }, {});
  Bubble.associate = function(models) {
    Bubble.belongsTo(models.User)
    Bubble.hasMany(models.Thread)
    Bubble.hasMany(models.UserBubbles)
  };
  return Bubble;
};