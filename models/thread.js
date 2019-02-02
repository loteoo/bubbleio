'use strict';
module.exports = (sequelize, DataTypes) => {
  const Thread = sequelize.define('Thread', {
    title: DataTypes.STRING,
    type: DataTypes.STRING,
    link: DataTypes.STRING,
    image: DataTypes.STRING,
    text: DataTypes.TEXT
  }, {});
  Thread.associate = function(models) {
    Thread.belongsTo(models.User)
    Thread.belongsTo(models.Bubble)
    Thread.hasMany(models.Message)
  };
  return Thread;
};