'use strict';
module.exports = (sequelize, DataTypes) => {
  const Parent = sequelize.define('Parent', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.STRING,
      unique: true
    },
    address: {
      type: DataTypes.STRING
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true
    },
    blood_type: {
      type: DataTypes.STRING
    },
    school_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    birthday: {
      type: DataTypes.DATEONLY
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other')
    }
  }, {
    timestamps: true // adds createdAt and updatedAt
  });

  Parent.associate = function(models) {
    // One-to-One with User
    Parent.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    // One-to-Many with Students
    Parent.hasMany(models.Student, {
      foreignKey: 'parent_id',
      as: 'students'
    });
  };

  return Parent;
};
