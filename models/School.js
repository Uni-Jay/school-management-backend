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
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {});
  School.associate = function(models) {
    School.hasMany(models.User, { foreignKey: 'school_id' });
    School.hasMany(models.Teacher, { foreignKey: 'school_id', as: 'teachers' });
    School.hasMany(models.Student, { foreignKey: 'school_id', as: 'students' });
    School.hasMany(models.Parent, { foreignKey: 'school_id', as: 'parents' });
    School.hasMany(models.Class, { foreignKey: 'school_id', as: 'classes' });
    School.hasMany(models.Subject, { foreignKey: 'school_id', as: 'subjects' });
    School.hasMany(models.Event, { foreignKey: 'school_id', as: 'events' });
    School.hasMany(models.Announcement, { foreignKey: 'school_id', as: 'announcements' });
    School.hasMany(models.Assignment, { foreignKey: 'school_id', as: 'assignments' });
    School.hasMany(models.Attendance, { foreignKey: 'school_id', as: 'attendances' });
    School.hasMany(models.Lesson, { foreignKey: 'school_id', as: 'lessons' });
    School.hasMany(models.GradeScheme, { foreignKey: 'school_id', as: 'gradeSchemes' });
    School.hasMany(models.Exam, { foreignKey: 'school_id', as: 'exams' })
    School.hasMany(models.SchoolSuperAdmin, { foreignKey: 'school_id', as: 'schoolSuperAdmins' });
    School.hasMany(models.SchoolAdmin, { foreignKey: 'school_id', as: 'schoolAdmins' });
    School.hasMany(models.User, { foreignKey: 'school_id', as: 'users' });
    School.hasMany(models.Notification, { foreignKey: 'school_id', as: 'notifications' });
    School.hasMany(models.Question, { foreignKey: 'school_id', as: 'questions' });

  };
  return School;
};
