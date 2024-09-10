import dotenv from "dotenv";
dotenv.config({ path: `.env` });
import express from "express";
import sequelize from "./db.js";
import cors from "cors";
import router from "./routes/index.js";
import errorHandler from "./middleware/ErrorHandlingMiddleware.js";

const PORT = process.env.PORT;
const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  }),
);
app.use(express.json());
app.use("/api", router);
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};
start();
