import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3001,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    jwtSecret: process.env.JWT_SECRET || 'carbon-emission-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 10,
})); 