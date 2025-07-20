import { Controller, Body, Post, UseGuards, Get, Res, HttpCode, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { JwtGuard } from './guard/jwt.guard';
import { GetUser } from './decorator/get-user.decorator';
import { Request, Response } from 'express';
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

    @Get('refresh')
    @HttpCode(200)
    refreshTokens(@Res({ passthrough: true }) res: Response, @Req() request: Request ) {
        const refreshToken = request.cookies['refresh_token'];
        return this.authService.refreshTokens(refreshToken, res);
    }

    @Post('logout')
    @HttpCode(200)
    logout(@Res({ passthrough: true}) res: Response, @Req() req: Request ) {
        res.clearCookie('refresh_token');
        return { message: 'Logged out'};
    }
}
