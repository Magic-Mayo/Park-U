module.exports = (sequelize, DataTypes)=>{
    const User = sequelize.define('User', {
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            underscored: true,
            validate: {
                len: [1, 50]
            }
        }
    })

    User.associate = (models) => {
        User.hasMany(models.Character, {
            foreignKey: {
                allowNull: false,
            },
            onDelete: 'cascade'
        })
    }
    return User
}