const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const CreateEvent = sequelize.define(
  "CreateEvent",
  {
    event_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    event_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    target_audience: {
      type: DataTypes.JSON, // Storing array of department names
      allowNull: false,
    },
  },
  {
    tableName: "events",
    timestamps: false, // ✅ Disables `createdAt` & `updatedAt`
  }
);

module.exports = CreateEvent;
