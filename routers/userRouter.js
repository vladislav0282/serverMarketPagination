import { Router } from "express";
import { userController } from "../controllers/userController.js";
import authMiddlewere from "../middlewere/authMiddlewere.js";
import chekRole from "../middlewere/chekRoleMiddlewere.js";

const router = new Router();

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.get("/auth", authMiddlewere, userController.check);
router.get("/role", chekRole("ADMIN"), userController.check);

export default router;
