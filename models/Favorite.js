module.exports = (sequelize, DataType) => {
    const Favorite = sequelize.define("Favorites", {
        idFavorite: { type: DataType.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    });
    return Favorite;
};

