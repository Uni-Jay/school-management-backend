'use strict';
module.exports = (sequelize, DataTypes) => {
  const SchoolAdmin = sequelize.define('SchoolAdmin', {
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
    school_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    birthday: {
      type: DataTypes.DATEONLY
    }
  }, {
    timestamps: true // includes createdAt and updatedAt
  });
    SchoolAdmin.associate = function(models) {
        // One-to-One with User
        SchoolAdmin.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
        });

        // Optional: One-to-One with Teacher (if a school admin can also be a teacher)
        SchoolAdmin.belongsTo(models.Teacher, {
        foreignKey: 'teacher_id',
        as: 'teacherProfile'
        });
    
        // Association with School
        SchoolAdmin.belongsTo(models.School, {
        foreignKey: 'school_id',
        as: 'school'
        });
    };
  return SchoolAdmin;
};
