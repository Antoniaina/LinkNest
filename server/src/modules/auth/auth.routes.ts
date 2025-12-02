import { Router } from "express";
import { signup, login, refresh, logout } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthSchema } from "./auth.schema";

const router = Router();

router.post('/signup',validateRequest(AuthSchema) , signup);
router.post('/login',validateRequest(AuthSchema) , login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;