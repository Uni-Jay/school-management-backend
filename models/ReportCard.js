module.exports = (sequelize, DataTypes) => {
    const ReportCard = sequelize.define('ReportCard', {
      student_id: DataTypes.INTEGER,
      term: DataTypes.STRING,
      total_score: DataTypes.FLOAT,
      average_score: DataTypes.FLOAT,
      position: DataTypes.INTEGER,
      grade: DataTypes.STRING,
      remarks: DataTypes.STRING,
      school_id: { type: DataTypes.INTEGER, allowNull: false }
    });
  
    ReportCard.associate = models => {
      ReportCard.belongsTo(models.Student, { foreignKey: 'student_id' });
      ReportCard.belongsTo(models.School, { foreignKey: 'school_id' });
    };
  
    return ReportCard;
  };
  