import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

// 业务模块
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { CarbonModule } from './modules/carbon/carbon.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { LogisticsModule } from './modules/logistics/logistics.module';

// 配置
import { databaseConfig } from './config/database.config';
import { appConfig } from './config/app.config';

@Module({
    imports: [
        // 配置模块
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, databaseConfig],
            envFilePath: ['.env.local', '.env'],
        }),

        // 数据库模块
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('database.host'),
                port: configService.get('database.port'),
                username: configService.get('database.username'),
                password: configService.get('database.password'),
                database: configService.get('database.name'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: configService.get('app.env') === 'development',
                logging: configService.get('app.env') === 'development',
                ssl: configService.get('app.env') === 'production' ? { rejectUnauthorized: false } : false,
            }),
            inject: [ConfigService],
        }),

        // 定时任务模块
        ScheduleModule.forRoot(),

        // 日志模块
        WinstonModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                transports: [
                    new winston.transports.Console({
                        format: winston.format.combine(
                            winston.format.timestamp(),
                            winston.format.colorize(),
                            winston.format.printf(({ timestamp, level, message, context }) => {
                                return `${timestamp} [${context}] ${level}: ${message}`;
                            }),
                        ),
                    }),
                    new winston.transports.File({
                        filename: 'logs/error.log',
                        level: 'error',
                        format: winston.format.combine(
                            winston.format.timestamp(),
                            winston.format.json(),
                        ),
                    }),
                    new winston.transports.File({
                        filename: 'logs/combined.log',
                        format: winston.format.combine(
                            winston.format.timestamp(),
                            winston.format.json(),
                        ),
                    }),
                ],
            }),
            inject: [ConfigService],
        }),

        // 业务模块
        AuthModule,
        DashboardModule,
        CarbonModule,
        WarehouseModule,
        LogisticsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { } 