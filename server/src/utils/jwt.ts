import Jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string) => {
    return Jwt.sign(
        { id: userId }, 
        process.env.ACCESS_TOKEN_EXP! as string, { 
        expiresIn: process.env.ACCESS_TOKEN_EXP! as string 
    });
};

export const generateRefreshToken = (userId: string) => {
    return Jwt.sign(
        { id: userId }, 
        process.env.REFRESH_TOKEN_EXP! as string, { 
        expiresIn: process.env.REFRESH_TOKEN_EXP! as string 
    });
};
