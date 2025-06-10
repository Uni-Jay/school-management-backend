'use strict';
module.exports = (sequelize, DataTypes) => {
  const School = sequelize.define('School', {
    name: DataTypes.STRING,
    type: DataTypes.ENUM('public', 'private'),
    logo_url: DataTypes.STRING,
    contact_email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    website: DataTypes.STRING,
    established_year: DataTypes.INTEGER,
    description: DataTypes.TEXT,
  }, {});
  School.associate = function(models) {
    School.hasMany(models.User, { foreignKey: 'school_id' });
  };
  return School;
};
