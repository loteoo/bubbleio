'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Bubble)
    User.hasMany(models.Bump)
    User.hasMany(models.Thread)
    User.hasMany(models.Message)
    User.hasMany(models.UserBubbles)
  };
  return User;
};