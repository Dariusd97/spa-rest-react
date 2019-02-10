module.exports = (sequelize, DataType) => {
    const User = sequelize.define("Users", {
        idUser: { type: DataType.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
        username: { type: DataType.STRING(30), allowNull: false,unique:true , validate : {
            len : [1,30],
            isEmail : true
        }},
        password: { type: DataType.STRING(30), allowNull: false , validate : {
            len: [1, 30]
        }},
        firstName: { type: DataType.STRING(30), allowNull: false, validate :{
            len : [1, 30]    
        }},
        lastName: { type: DataType.STRING(30), allowNull: false, validate : {
            len : [1, 30]
        } },
    });
    return User;
};



