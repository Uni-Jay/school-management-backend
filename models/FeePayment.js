module.exports = (sequelize, DataTypes) => {
    const FeePayment = sequelize.define('FeePayment', {
      student_id: DataTypes.INTEGER,
      fee_structure_id: DataTypes.INTEGER,
      amount_paid: DataTypes.FLOAT,
      payment_date: DataTypes.DATE,
      payment_method: DataTypes.STRING, // 'cash', 'paystack', etc.
      reference: DataTypes.STRING,
      school_id: { type: DataTypes.INTEGER, allowNull: false }
    });
  
    FeePayment.associate = models => {
      FeePayment.belongsTo(models.Student, { foreignKey: 'student_id' });
      FeePayment.belongsTo(models.FeeStructure, { foreignKey: 'fee_structure_id' });
      FeePayment.belongsTo(models.School, { foreignKey: 'school_id' });
    };
  
    return FeePayment;
  };
  