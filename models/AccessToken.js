module.exports = (sequelize, DataType) => {
    const AccessToken = sequelize.define("AccessToken", {
        token:{type:DataType.STRING,allowNull:false}
    });
    
    return AccessToken;
}
