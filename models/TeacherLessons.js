'use strict';
module.exports = (sequelize, DataTypes) => {
  const TeacherLessons = sequelize.define('TeacherLessons', {
    teacher_id: DataTypes.INTEGER,
    lesson_id: DataTypes.INTEGER,
    school_id: DataTypes.INTEGER
  }, {
    timestamps: false
  });

  return TeacherLessons;
};
