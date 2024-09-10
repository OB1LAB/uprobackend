import sequelize from "../db.js";
import { DataTypes } from "sequelize";

const UserModel = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  group: {
    type: DataTypes.STRING,
  },
  scheduler: {
    type: DataTypes.STRING,
  },
});

export { UserModel };
