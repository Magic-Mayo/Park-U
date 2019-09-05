module.exports = (sequelize, DataTypes)=>{
    const Attack = sequelize.define('Attack', {
        class: {
            type: DataTypes.STRING,
            allowNull: false
        },
        attackOneName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        attackTwoName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        attackThreeName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        attackFourName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        attackOneDmg: {
            type: DataTypes.STRING,
            allowNull: false
        },
        attackTwoDmg: {
            type: DataTypes.STRING,
            allowNull: false
        },
        attackThreeDmg: {
            type: DataTypes.STRING,
            allowNull: false
        },
        attackFourDmg: {
            type: DataTypes.STRING,
            allowNull: false
        },
        attackOneAcc: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        attackTwoAcc: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        attackThreeAcc: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        attackFourAcc: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },
    {timestamps: false}
    )

    Attack.associate = (models) => {
        Attack.hasMany(models.Character, {
            foreignKey: {
                allowNull: false
            },
            constraints: false
        })
    }
    return Attack;
}
