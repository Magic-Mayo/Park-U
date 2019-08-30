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
        }
    });

    User.associate = (models) => {
        User.hasMany(models.Character, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'cascade',
            constraints: false
        });
    }
    return User;
}