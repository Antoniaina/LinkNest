import { Controller, Body, Post, UseGuards, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { JwtGuard } from './guard/jwt.guard';
import { GetUser } from './decorator/get-user.decorator';
import { Response } from 'express';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService
    ) {}

    @Post('signup')
    signup(@Body() dto: SignUpDto, @Res({ passthrough: true }) res: Response){
        return this.authService.signup(dto, res);
    }

    @Post('signin')
    signin(@Body() dto: SignInDto, @Res({ passthrough: true }) res: Response){
        return this.authService.signin(dto, res);
    }

    @Get('me')
    @UseGuards(JwtGuard)
    getProfile(@GetUser() user){
        return this.userService.findById(user.sub);
    }
}
