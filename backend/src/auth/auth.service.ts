import { Injectable, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt'
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) {}

    async signup(dto: SignUpDto, res: Response) {
        const { email, password, username } = dto;

        const exisiting = await this.prisma.user.findUnique({
            where: {email}
        })

        if (exisiting) {
            throw new ConflictException('Email already used');
        }

        const hashed = await bcrypt.hash(password, 10) ;

        const user = await this.prisma.user.create({
            data:{
                email,
                username,
                password: hashed,
            }
        });

        const tokens = this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, (await tokens).refresh_token);

        res.cookie('refresh_token', (await tokens).refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        return { access_token: (await tokens).access_token }
    }

    async signin(dto: SignInDto, res: Response) {
        const { email, password } = dto;

        const user = await this.prisma.user.findUnique({
            where: {email}
        });

        if(!user) throw new ForbiddenException('Email address not found');

        const pwMatch = await bcrypt.compare(password, user.password) ;
        if (!pwMatch) throw new ForbiddenException('Credentials incorrect');

        const tokens = this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, (await tokens).refresh_token);

        res.cookie('refresh_token', (await tokens).refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        return { access_token: (await tokens).access_token }

    }

    async getTokens(userId: number, email: string) {
        const payload = {sub: userId , email};

        const [accessToken, refreshToken] = await Promise.all([
            this.jwt.signAsync(payload, {
                secret: this.config.get<string>('JWT_ACCESS_SECRET'),
                expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN'),
            }),
            this.jwt.signAsync(payload, {
                secret: this.config.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN'),
            }),
        ]);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        }
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const hash = await bcrypt.hash(refreshToken, 10);
        await this.prisma.user.update({
            where: {id: userId},
            data: { hashedRefreshToken: hash },
        });
    }

    async refreshTokens(refreshToken: string, res: Response) {
        if (!refreshToken) throw new ForbiddenException('No refresh token');

        const user = await this.prisma.user.findFirst({
            where: {
                hashedRefreshToken: {
                    not: null,
                },
            },
        })

        if (!user || !user.hashedRefreshToken) throw new ForbiddenException('Access denied');

        const rtMatch = bcrypt.compare(refreshToken, user.hashedRefreshToken);
        if (!rtMatch) throw new ForbiddenException('Invalid refresh token');

        const tokens = this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, (await tokens).refresh_token);

        res.cookie('refresh_token', (await tokens).refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        
        return {
            access_token: (await tokens).access_token,
        }
    }
}
