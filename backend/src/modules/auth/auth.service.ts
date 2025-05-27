import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    /**
     * 用户登录
     */
    async login(loginDto: { username: string; password: string }) {
        // TODO: 实现真实的登录逻辑
        const { username, password } = loginDto;

        // 模拟验证
        if (username === 'admin' && password === 'admin123') {
            return {
                access_token: 'mock-jwt-token',
                user: {
                    id: 1,
                    username: 'admin',
                    email: 'admin@example.com',
                    role: 'admin',
                },
            };
        }

        throw new Error('用户名或密码错误');
    }

    /**
     * 用户注册
     */
    async register(registerDto: { username: string; password: string; email: string }) {
        // TODO: 实现真实的注册逻辑
        const { username, password, email } = registerDto;

        return {
            message: '注册成功',
            user: {
                id: Date.now(),
                username,
                email,
                role: 'user',
            },
        };
    }

    /**
     * 验证用户
     */
    async validateUser(username: string, password: string) {
        // TODO: 实现真实的用户验证逻辑
        if (username === 'admin' && password === 'admin123') {
            return {
                id: 1,
                username: 'admin',
                email: 'admin@example.com',
                role: 'admin',
            };
        }
        return null;
    }
} 