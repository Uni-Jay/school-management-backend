'use strict';
module.exports = (sequelize, DataTypes) => {
  const StudentSubjects = sequelize.define('StudentSubjects', {
    student_id: DataTypes.INTEGER,
    subject_id: DataTypes.INTEGER,
    school_id: DataTypes.INTEGER
  }, {
    timestamps: false
  });

  return StudentSubjects;
};
