import { User } from "../user/user.model";
import { generateToken } from "../../utils/jwt";
import bcrypt from "bcrypt";
import { success } from "zod";

export default class AuthService {
    static async signup(email: string, password: string) {
        try {
            const exists = await User.findOne({ email });
            if (exists) 
                return {
                    success: false,
                    status: 400,
                    message: "An account with this email address already exists"
                };
            
            const hashed = await bcrypt.hash(password, 10);

            const user = await User.create({
                email,
                password: hashed,
            });
            const safeUser = {
                id: user._id.toString(),
                email: user.email,
            }

            const token = generateToken(user._id.toString());

            return {
                success: true,
                status: 201,
                message: "Account created successfully",
                data: { user: safeUser, token }, 
            };
        } catch (err) {
            console.error("Signup error:", err);
            return {
                success: false,
                status: 500,
                message: "Server error",
            };
        }
    }

    static async login(email: string, password: string) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return {
                    success: false,
                    status: 401,
                    message: "Incorrect email or password",
                };
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return {
                    success: false,
                    status: 401,
                    message: "Incorrect email or password",
                };
            }
    
            const token = generateToken(user._id.toString());
    
            return {
                success: true, 
                status: 200,
                message: "Successful connection",
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                    },
                    token,
                },
            };
        } catch (err) {
            console.error("Login error:", err);
            return {
                success: false,
                status: 500,
                message: "Server error",
            };
        }
    } 
}