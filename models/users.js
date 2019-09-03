module.exports = (sequelize, DataTypes)=>{
    const User = sequelize.define('User', {
        userName: {
            type: DataTypes.STRING,
            underscored: true,
            validate: {
                len: [1, 50]
            }
        },
        pass: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        locked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        invalidAttempt: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    });

    User.associate = (models) => {
        User.hasMany(models.Character, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'cascade',
        });
    }
    User.associate = (models) => {
        User.hasMany(models.Token, {
            foreignKey: {
                allowNull: false
            },
        })
    }
    return User;
}