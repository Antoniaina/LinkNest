import { Router } from "express";
import { profile } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

router.get('/profile', authMiddleware, profile);

export default router;
