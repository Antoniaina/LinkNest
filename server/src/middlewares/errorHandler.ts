import type { Request, Response, NextFunction } from "express";
import { success } from "zod";
export class AppError extends Error {
    readonly statusCode: number
    
    constructor(message: string, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;

        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

export class AuthError extends AppError {
    constructor(message: string, statusCode = 401) {
        super(message, statusCode);
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}

export const errorHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    console.error("Unexpected Error:", err);
    return res.status(500).json({
        success: false,
        message: "Internal server error"
    })    
}