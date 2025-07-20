import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async findById(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: {id: userId},
        })

        if (!user) throw new NotFoundException('User not found');

        const {password, ...userSafe} = user;
        return userSafe;
    }
}
