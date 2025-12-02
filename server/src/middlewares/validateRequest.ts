import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const validateRequest = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.issues.map(err => ({
                    path: err.path[0],
                    message:err.message,
                })) ,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });    
    }
};