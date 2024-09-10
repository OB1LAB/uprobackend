import { Router } from "express";
import ScheduleRouter from "./ScheduleRouter.js";
import UserRouter from "./UserRouter.js";
const router = new Router();
router.use("/schedule", ScheduleRouter);
router.use("/user", UserRouter);
export default router;
