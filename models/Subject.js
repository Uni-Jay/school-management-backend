'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('Subject', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    school_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});

  Subject.associate = function(models) {
    // Many-to-Many with Teacher
    Subject.belongsToMany(models.Teacher, {
      through: 'TeacherSubjects',
      foreignKey: 'subject_id',
      otherKey: 'teacher_id',
      as: 'teachers'
    });
    // Many-to-Many with Class
    Subject.belongsToMany(models.Class, {
      through: 'ClassSubjects',
      foreignKey: 'subject_id',
      otherKey: 'class_id',
      as: 'classes'
    });
    // Many-to-Many with Student
    Subject.belongsToMany(models.Student, {
      through: 'StudentSubjects',
      foreignKey: 'subject_id',
      otherKey: 'student_id',
      as: 'students'
    });
    // One-to-One with School
    Subject.belongsTo(models.School, {
      foreignKey: 'school_id',
      as: 'school'
    });

    // One-to-Many with Lesson
    Subject.hasMany(models.Lesson, {
      foreignKey: 'subject_id',
      as: 'lessons'
    });
  };

  return Subject;
};
