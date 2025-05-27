import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('认证管理')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: '用户登录' })
    @ApiResponse({ status: 200, description: '登录成功' })
    async login(@Body() loginDto: { username: string; password: string }) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    @ApiOperation({ summary: '用户注册' })
    @ApiResponse({ status: 201, description: '注册成功' })
    async register(@Body() registerDto: { username: string; password: string; email: string }) {
        return this.authService.register(registerDto);
    }
} 