import { User } from "../user/user.model";
import { generateToken } from "../../utils/jwt";
import bcrypt from "bcrypt";
import { AuthError, ConflictError } from "../../middlewares/errorHandler";

type AuthUser = {
    id: string;
    email: string;
};

type AuthPayload = {
    user: AuthUser;
    token: string;
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

        const token = generateToken(user._id.toString());

        return {
            user: {
                id: user._id.toString(),
                email: user.email,
            },
            token,
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

        const token = generateToken(user._id.toString());

        return {
            user: {
                id: user._id.toString(),
                email: user.email,
            },
            token,
        };
    }
}