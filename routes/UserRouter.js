import { Router } from "express";
import UserController from "../controllers/UserController.js";
import AdminHandlingMiddleware from "../middleware/AdminHandlingMiddleware.js";

const router = new Router();
router.get("/", AdminHandlingMiddleware, UserController.getUsers);
router.post("/create", AdminHandlingMiddleware, UserController.createUser);
router.post("/setGroup", AdminHandlingMiddleware, UserController.setGroup);
router.post(
  "/setSchedule",
  AdminHandlingMiddleware,
  UserController.setScheduler,
);

export default router;
