'use strict';
module.exports = (sequelize, DataTypes) => {
  const TeacherSubjects = sequelize.define('TeacherSubjects', {
    teacher_id: DataTypes.INTEGER,
    subject_id: DataTypes.INTEGER,
    school_id: DataTypes.INTEGER
  }, {
    timestamps: false
  });

  return TeacherSubjects;
};
