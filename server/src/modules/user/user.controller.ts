import type { Request, Response, NextFunction } from "express";
import { User } from "./user.model";
import { AuthenticatedRequest } from "../../middlewares/auth";
import { AuthError } from "../../middlewares/errorHandler";

export const profile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user?.id) return next(new AuthError("Unauthorized", 401));
        
        const user = await User.findById(req.user.id).select("_id email");
        if (!user) return next(new AuthError("User not found", 404));

        return res.status(200).json({
            success: true,
            data: { id: user._id, email: user.email }
        });
    } catch (error) { 
        next(error); 
    }

};
