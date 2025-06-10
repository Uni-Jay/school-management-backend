'use strict';
module.exports = (sequelize, DataTypes) => {
  const StudentLessons = sequelize.define('StudentLessons', {
    student_id: DataTypes.INTEGER,
    lesson_id: DataTypes.INTEGER,
    school_id: DataTypes.INTEGER
  }, {
    timestamps: false
  });

  return StudentLessons;
};
