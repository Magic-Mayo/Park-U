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