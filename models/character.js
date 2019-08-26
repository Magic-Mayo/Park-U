module.exports = (sequelize, DataTypes)=>{
    const Character = sequelize.define('Character', {
        charName: {
            type: DataTypes.STRING,
            underscored: true,
            allowNull: false,
            validate: {
                len: [1, 30]
            }
        },
        class: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        attack: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        defense: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        luck: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        hp: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })

    Character.associate = (models) => {
        Character.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
            },
        })
    }
    return Character
}