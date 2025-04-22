const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Admin = sequelize.define("Admin", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true, // Ensures the input is a valid email
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Admin;
