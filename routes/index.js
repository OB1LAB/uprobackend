import { Router } from "express";
import ScheduleRouter from "./ScheduleRouter.js";
const router = new Router();
router.use("/schedule", ScheduleRouter);
export default router;
