import { Router } from "express";
import ScheduleController from "../controllers/ScheduleController.js";

const router = new Router();
router.get("/", ScheduleController.get);

export default router;
