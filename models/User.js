'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    full_name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    role: DataTypes.ENUM(
      'super_admin',
      'school_super_admin',
      'school_admin',
      'teacher',
      'student',
      'parent'
    ),
    school_id: DataTypes.INTEGER,
  });

  User.associate = (models) => {
  User.hasOne(models.SuperAdmin, {
    foreignKey: 'user_id',
    as: 'superAdminProfile',
  });
  User.hasOne(models.SchoolSuperAdmin, {
    foreignKey: 'user_id',
    as: 'schoolSuperAdminProfile',
  });
  User.hasOne(models.SchoolAdmin, {
    foreignKey: 'user_id',
    as: 'schoolAdminProfile',
  });
  User.hasOne(models.Teacher, {
    foreignKey: 'user_id',
    as: 'teacherProfile',
  });
  User.hasOne(models.Student, {
    foreignKey: 'user_id',
    as: 'studentProfile',
  });
  User.hasOne(models.Parent, {
    foreignKey: 'user_id',
    as: 'parentProfile',
  });
  User.hasMany(models.OTP, {
    foreignKey: 'user_id',
    as: 'otps',
  });
  User.hasMany(models.Announcement, {
    foreignKey: 'created_by',
    as: 'announcements',
  });
  User.hasMany(models.Assignment, {
    foreignKey: 'created_by',
    as: 'assignments',
  });
  User.hasMany(models.Attendance, {
    foreignKey: 'created_by',
    as: 'attendances',
  });
  User.hasMany(models.Class, {
    foreignKey: 'created_by',
    as: 'classes',
  });
  User.hasMany(models.Exam, {
    foreignKey: 'created_by',
    as: 'exams',
  });
  User.hasMany(models.Event, {
    foreignKey: 'created_by',
    as: 'events',
  });
  User.hasMany(models.Lesson, {
    foreignKey: 'created_by',
    as: 'lessons',
  });
  User.hasMany(models.GradeScheme, {
    foreignKey: 'created_by',
    as: 'gradeSchemes',
  });
  User.hasMany(models.Subject, {
    foreignKey: 'created_by',
    as: 'subjects',
  });
  User.hasMany(models.Notification, {
    foreignKey: 'user_id',
    as: 'notifications',
  });

}






  return User;
};
