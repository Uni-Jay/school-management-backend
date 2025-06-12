module.exports = (sequelize, DataTypes) => {
    const Score = sequelize.define('Score', {
      student_id: DataTypes.INTEGER,
      subject_id: DataTypes.INTEGER,
      exam_id: DataTypes.INTEGER,
      score: DataTypes.FLOAT,
      term: DataTypes.INTEGER,
      grade: DataTypes.STRING,
      remarks: DataTypes.STRING,
      school_id: { type: DataTypes.INTEGER, allowNull: false }
    });
  
    Score.associate = models => {
      Score.belongsTo(models.Student, { foreignKey: 'student_id' });
      Score.belongsTo(models.Subject, { foreignKey: 'subject_id' });
      Score.belongsTo(models.Exam, { foreignKey: 'exam_id' });
      Score.belongsTo(models.School, { foreignKey: 'school_id' });
    };
  
    return Score;
  };
  