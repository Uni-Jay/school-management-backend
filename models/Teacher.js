'use strict';
module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
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

  Teacher.associate = function(models) {
    // One-to-One with User
    Teacher.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    // Many-to-Many with Subject
    Teacher.belongsToMany(models.Subject, {
      through: 'TeacherSubjects',
      foreignKey: 'teacher_id',
      otherKey: 'subject_id',
      as: 'subjects'
    });

    // Many-to-Many with Lesson
    Teacher.belongsToMany(models.Lesson, {
      through: 'TeacherLessons',
      foreignKey: 'teacher_id',
      otherKey: 'lesson_id',
      as: 'lessons'
    });

    // Many-to-Many with Class
    Teacher.belongsToMany(models.Class, {
      through: 'TeacherClasses',
      foreignKey: 'teacher_id',
      otherKey: 'class_id',
      as: 'classes'
    });
    // One-to-Many with School
    Teacher.belongsTo(models.School, {
      foreignKey: 'school_id',
      as: 'school'
    });
  };

  return Teacher;
};
