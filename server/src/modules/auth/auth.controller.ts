import type { Request, Response, NextFunction } from "express";
import AuthService from "./auth.service";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await AuthService.signup(email, password);

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            data: { user, token },
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await AuthService.login(email, password);

        return res.status(200).json({
            success: true,
            message: "Successful connection",
            data: { user, token },
        });
    } catch (error) {
        next(error);
    }
};