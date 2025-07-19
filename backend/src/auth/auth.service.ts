import { Injectable, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService
    ) {}

    async signup(dto: SignUpDto){
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

        const { password:_, ...userWithoutPassword } = user ;
        return userWithoutPassword ;
    }

    async signin(dto: SignInDto){
        const { email, password } = dto;

        const user = await this.prisma.user.findUnique({
            where: {email}
        });

        if(!user) throw new ForbiddenException('Email address not found');

        const pwMatch = await bcrypt.compare(password, user.password) ;
        if (!pwMatch) throw new ForbiddenException('Credentials incorrect');

        const payload = { sub: user.id, email: user.email };

        const token = await this.jwt.signAsync(payload);

        return {
            access_token: token,
        };

    }
}
