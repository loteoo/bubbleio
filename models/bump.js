'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bump = sequelize.define('Bump', {
    size: DataTypes.INTEGER
  }, {});
  Bump.associate = function(models) {
    Bump.belongsTo(models.Thread);
    Bump.belongsTo(models.User);
  };
  return Bump;
};