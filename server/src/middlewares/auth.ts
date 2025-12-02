import type { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import { AuthError } from "./errorHandler";

export interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

export function authMiddleware(
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) 
        return next(new AuthError("Access token required", 401));
    
    const token = header.split(" ")[1];
    try {
        const decoded = Jwt.verify(
            token,
            process.env.ACCESS_TOKEN_EXP! as string 
        ) as { id: string };

        req.user = { id: decoded.id };
        next();
    } catch (err) {
        return next(new AuthError("Invalid or expired access token", 401));
    }
}
