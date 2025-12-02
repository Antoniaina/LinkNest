import type { Request, Response } from "express";
import AuthService from "./auth.service";

export const signup = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await AuthService.signup(email, password);
    return res.status(result.status).json(result);
}

export const login = async (req: Request, res: Response) => {
    res.json({});
};