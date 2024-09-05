import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import errorHandler from "./middleware/ErrorHandlingMiddleware.js";

const PORT = 5010;
const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  }),
);
app.use(express.json());
app.use("/api", router);
app.use(errorHandler);

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};
start();
