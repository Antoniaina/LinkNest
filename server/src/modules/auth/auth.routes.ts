import { Router } from "express";
import { signup, login } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthSchema } from "./auth.schema";

const router = Router();

router.post('/signup',validateRequest(AuthSchema) , signup);
router.post('/login',validateRequest(AuthSchema) , login);

export default router;