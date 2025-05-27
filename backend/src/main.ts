import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // 安全中间件
    app.use(helmet());
    app.use(compression());

    // 限流中间件
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000, // 15分钟
            max: 100, // 限制每个IP 15分钟内最多100个请求
            message: '请求过于频繁，请稍后再试',
        }),
    );

    // 全局管道
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // 自动删除非装饰器属性
            forbidNonWhitelisted: true, // 当有非白名单属性时抛出错误
            transform: true, // 自动转换类型
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // 全局过滤器
    app.useGlobalFilters(new HttpExceptionFilter());

    // 全局拦截器
    app.useGlobalInterceptors(
        new LoggingInterceptor(),
        new TransformInterceptor(),
    );

    // CORS配置
    app.enableCors({
        origin: configService.get('FRONTEND_URL', 'http://localhost:3000'),
        credentials: true,
    });

    // API前缀
    app.setGlobalPrefix('api/v1');

    // Swagger文档配置
    const config = new DocumentBuilder()
        .setTitle('冷库碳排放监测管理系统 API')
        .setDescription('冷库物流园区碳排放检测管理系统的后端API文档')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth',
        )
        .addTag('认证管理', '用户认证相关接口')
        .addTag('仪表板', '仪表板数据接口')
        .addTag('碳排放管理', '碳排放监测与管理接口')
        .addTag('冷库管理', '冷库信息与监控接口')
        .addTag('物流管理', '物流运输管理接口')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });

    const port = configService.get('PORT', 3001);
    await app.listen(port);

    console.log(`🚀 应用已启动，运行在端口 ${port}`);
    console.log(`📚 API文档地址: http://localhost:${port}/api/docs`);
}

bootstrap(); 