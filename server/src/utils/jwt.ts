import Jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
    return Jwt.sign(
        { id: userId }, 
        process.env.JWT_SECRET! as string, { 
        expiresIn: process.env.JWT_EXPIRES_IN! as string 
    });
};
