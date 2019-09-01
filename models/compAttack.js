module.exports = (sequelize, DataTypes) => {
    const CompAttack = sequelize.define('CompAttacks', {
        compChar: {
            type: DataTypes.INTEGER
        },
        attackOne: {
            type: DataTypes.STRING
        },
        attackTwo: {
            type: DataTypes.STRING
        },
        attackThree: {
            type: DataTypes.STRING
        },
        attackFour: {
            type: DataTypes.STRING
        },
        attackOneName: {
            type: DataTypes.STRING
        },
        attackTwoName: {
            type: DataTypes.STRING
        },
        attackThreeName: {
            type: DataTypes.STRING
        },
        attackFourName: {
            type: DataTypes.STRING
        },
        attackOneAcc: {
            type: DataTypes.INTEGER
        },
        attackTwoAcc: {
            type: DataTypes.INTEGER
        },
        attackThreeAcc: {
            type: DataTypes.INTEGER
        },
        attackFourAcc: {
            type: DataTypes.INTEGER
        },
        attackLevel: {
            type: DataTypes.INTEGER
        }
    }, {timestamps: false})
    return CompAttack;
}