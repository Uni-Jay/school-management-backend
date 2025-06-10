'use strict';
module.exports = (sequelize, DataTypes) => {
  const SuperAdmin = sequelize.define('SuperAdmin', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
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
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other')
    },
    teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: true // Optional, if a school admin can also be a teacher
    },
    // school_id: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
    birthday: {
      type: DataTypes.DATEONLY
    }
  }, {
    timestamps: true // includes createdAt and updatedAt
  });
    
  return SuperAdmin;
};
