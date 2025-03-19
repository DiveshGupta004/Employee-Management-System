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
    rsvp_deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reminder_time: {
      type: DataTypes.STRING, // Example: "1 day before"
      allowNull: false,
    },
    calendar_integration: {
      type: DataTypes.STRING, // Example: "Google, Outlook"
      allowNull: true,
    },
  },
  {
    tableName: "events",
    timestamps: false, // ✅ Disables `createdAt` & `updatedAt`
  }
);

module.exports = CreateEvent;
