import { User } from "../user/user.model";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import bcrypt from "bcrypt";
import { AuthError, ConflictError } from "../../middlewares/errorHandler";
import Jwt from "jsonwebtoken";

type AuthUser = {
    id: string;
    email: string;
};

type AuthPayload = {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
};

export default class AuthService {
    static async signup(email: string, password: string): Promise<AuthPayload> {
        const exists = await User.findOne({ email });
        if (exists) {
            throw new ConflictError(
                "An account with this email address already exists"
            );
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashed,
        });

        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        return {
            user: {
                id: user._id.toString(),
                email: user.email,
            },
            accessToken,
            refreshToken,
        };
    }

    static async login(email: string, password: string): Promise<AuthPayload> {
        const user = await User.findOne({ email });
        if (!user) {
            throw new AuthError("Incorrect email or password", 401);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new AuthError("Incorrect email or password", 401);
        }

        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        return {
            user: {
                id: user._id.toString(),
                email: user.email,
            },
            accessToken,
            refreshToken,
        };
    }

    static async refresh(oldRefreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            const decoded: any = Jwt.verify(
                oldRefreshToken,
                process.env.REFRESH_TOKEN_EXP! as string
            );
            const userId = decoded.id;

            const accessToken = generateAccessToken(userId);
            const refreshToken = generateRefreshToken(userId);
            return { accessToken, refreshToken };
        } catch (err) {
            throw new AuthError("Invalid refresh token", 401);
        }
    }
}