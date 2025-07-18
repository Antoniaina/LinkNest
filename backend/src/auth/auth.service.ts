import { Injectable, ConflictException, ConfigurableModuleBuilder } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { SignUpDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService
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
}
