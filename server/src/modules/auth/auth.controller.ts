import type { Request, Response, NextFunction } from "express";
import AuthService from "./auth.service";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = await AuthService.signup(email, password);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            data: { user, accessToken },
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = await AuthService.login(email, password);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Successful connection",
            data: { user, accessToken },
        });
    } catch (error) {
        next(error);
    }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;

        const { accessToken, refreshToken } = await AuthService.refresh(oldRefreshToken);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
            data: { accessToken },
        });
    } catch (error) {
        next(error);
    }
}

export const logout = (req: Request, res: Response) => {
    res.cookie("refreshToken", "", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 0
    });
    return res.status(200).json({
        success: true,
        message: "Logout successful"
    });
}