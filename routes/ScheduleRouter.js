import { Router } from "express";
import ScheduleController from "../controllers/ScheduleController.js";
import AdminHandlingMiddleware from "../middleware/AdminHandlingMiddleware.js";

const router = new Router();
router.get("/", ScheduleController.get);
router.get(
  "/getDifference",
  AdminHandlingMiddleware,
  ScheduleController.getDifference,
);

export default router;
