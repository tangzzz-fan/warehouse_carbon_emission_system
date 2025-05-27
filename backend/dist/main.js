/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.module.ts":
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const schedule_1 = __webpack_require__(/*! @nestjs/schedule */ "@nestjs/schedule");
const nest_winston_1 = __webpack_require__(/*! nest-winston */ "nest-winston");
const winston = __webpack_require__(/*! winston */ "winston");
const auth_module_1 = __webpack_require__(/*! ./modules/auth/auth.module */ "./src/modules/auth/auth.module.ts");
const dashboard_module_1 = __webpack_require__(/*! ./modules/dashboard/dashboard.module */ "./src/modules/dashboard/dashboard.module.ts");
const carbon_module_1 = __webpack_require__(/*! ./modules/carbon/carbon.module */ "./src/modules/carbon/carbon.module.ts");
const warehouse_module_1 = __webpack_require__(/*! ./modules/warehouse/warehouse.module */ "./src/modules/warehouse/warehouse.module.ts");
const logistics_module_1 = __webpack_require__(/*! ./modules/logistics/logistics.module */ "./src/modules/logistics/logistics.module.ts");
const database_config_1 = __webpack_require__(/*! ./config/database.config */ "./src/config/database.config.ts");
const app_config_1 = __webpack_require__(/*! ./config/app.config */ "./src/config/app.config.ts");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [app_config_1.appConfig, database_config_1.databaseConfig],
                envFilePath: ['.env.local', '.env'],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
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
                inject: [config_1.ConfigService],
            }),
            schedule_1.ScheduleModule.forRoot(),
            nest_winston_1.WinstonModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    transports: [
                        new winston.transports.Console({
                            format: winston.format.combine(winston.format.timestamp(), winston.format.colorize(), winston.format.printf(({ timestamp, level, message, context }) => {
                                return `${timestamp} [${context}] ${level}: ${message}`;
                            })),
                        }),
                        new winston.transports.File({
                            filename: 'logs/error.log',
                            level: 'error',
                            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
                        }),
                        new winston.transports.File({
                            filename: 'logs/combined.log',
                            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
                        }),
                    ],
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            dashboard_module_1.DashboardModule,
            carbon_module_1.CarbonModule,
            warehouse_module_1.WarehouseModule,
            logistics_module_1.LogisticsModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);


/***/ }),

/***/ "./src/common/filters/http-exception.filter.ts":
/*!*****************************************************!*\
  !*** ./src/common/filters/http-exception.filter.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpExceptionFilter = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(HttpExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        const error = typeof exceptionResponse === 'string'
            ? { message: exceptionResponse }
            : exceptionResponse;
        const errorResponse = {
            success: false,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            ...error,
        };
        this.logger.error(`HTTP Exception: ${request.method} ${request.url}`, JSON.stringify(errorResponse));
        response.status(status).json(errorResponse);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], HttpExceptionFilter);


/***/ }),

/***/ "./src/common/interceptors/logging.interceptor.ts":
/*!********************************************************!*\
  !*** ./src/common/interceptors/logging.interceptor.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LoggingInterceptor_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggingInterceptor = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const operators_1 = __webpack_require__(/*! rxjs/operators */ "rxjs/operators");
let LoggingInterceptor = LoggingInterceptor_1 = class LoggingInterceptor {
    constructor() {
        this.logger = new common_1.Logger(LoggingInterceptor_1.name);
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, ip } = request;
        const userAgent = request.get('User-Agent') || '';
        const now = Date.now();
        this.logger.log(`${method} ${url} - ${ip} - ${userAgent} - 请求开始`);
        return next.handle().pipe((0, operators_1.tap)(() => {
            const responseTime = Date.now() - now;
            this.logger.log(`${method} ${url} - ${ip} - ${userAgent} - 响应时间: ${responseTime}ms`);
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = LoggingInterceptor_1 = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);


/***/ }),

/***/ "./src/common/interceptors/transform.interceptor.ts":
/*!**********************************************************!*\
  !*** ./src/common/interceptors/transform.interceptor.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransformInterceptor = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const operators_1 = __webpack_require__(/*! rxjs/operators */ "rxjs/operators");
let TransformInterceptor = class TransformInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((data) => ({
            success: true,
            data,
            message: '操作成功',
            timestamp: new Date().toISOString(),
        })));
    }
};
exports.TransformInterceptor = TransformInterceptor;
exports.TransformInterceptor = TransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], TransformInterceptor);


/***/ }),

/***/ "./src/config/app.config.ts":
/*!**********************************!*\
  !*** ./src/config/app.config.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.appConfig = void 0;
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
exports.appConfig = (0, config_1.registerAs)('app', () => ({
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3001,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    jwtSecret: process.env.JWT_SECRET || 'carbon-emission-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 10,
}));


/***/ }),

/***/ "./src/config/database.config.ts":
/*!***************************************!*\
  !*** ./src/config/database.config.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.databaseConfig = void 0;
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
exports.databaseConfig = (0, config_1.registerAs)('database', () => ({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    name: process.env.DB_NAME || 'carbon_emission_db',
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        password: process.env.REDIS_PASSWORD || '',
    },
}));


/***/ }),

/***/ "./src/modules/auth/auth.controller.ts":
/*!*********************************************!*\
  !*** ./src/modules/auth/auth.controller.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: '用户登录' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '登录成功' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: '用户注册' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: '注册成功' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('认证管理'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),

/***/ "./src/modules/auth/auth.module.ts":
/*!*****************************************!*\
  !*** ./src/modules/auth/auth.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./src/modules/auth/auth.controller.ts");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts");
const user_entity_1 = __webpack_require__(/*! ./entities/user.entity */ "./src/modules/auth/entities/user.entity.ts");
const jwt_strategy_1 = __webpack_require__(/*! ./strategies/jwt.strategy */ "./src/modules/auth/strategies/jwt.strategy.ts");
const local_strategy_1 = __webpack_require__(/*! ./strategies/local.strategy */ "./src/modules/auth/strategies/local.strategy.ts");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('app.jwtSecret'),
                    signOptions: {
                        expiresIn: configService.get('app.jwtExpiresIn'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, local_strategy_1.LocalStrategy],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),

/***/ "./src/modules/auth/auth.service.ts":
/*!******************************************!*\
  !*** ./src/modules/auth/auth.service.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let AuthService = class AuthService {
    async login(loginDto) {
        const { username, password } = loginDto;
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
    async register(registerDto) {
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
    async validateUser(username, password) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);


/***/ }),

/***/ "./src/modules/auth/entities/user.entity.ts":
/*!**************************************************!*\
  !*** ./src/modules/auth/entities/user.entity.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'user' }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], User.prototype, "updatedAt", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);


/***/ }),

/***/ "./src/modules/auth/strategies/jwt.strategy.ts":
/*!*****************************************************!*\
  !*** ./src/modules/auth/strategies/jwt.strategy.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_jwt_1 = __webpack_require__(/*! passport-jwt */ "passport-jwt");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('app.jwtSecret'),
        });
        this.configService = configService;
    }
    async validate(payload) {
        return {
            id: payload.sub,
            username: payload.username,
            role: payload.role,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], JwtStrategy);


/***/ }),

/***/ "./src/modules/auth/strategies/local.strategy.ts":
/*!*******************************************************!*\
  !*** ./src/modules/auth/strategies/local.strategy.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStrategy = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_local_1 = __webpack_require__(/*! passport-local */ "passport-local");
const auth_service_1 = __webpack_require__(/*! ../auth.service */ "./src/modules/auth/auth.service.ts");
let LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(authService) {
        super();
        this.authService = authService;
    }
    async validate(username, password) {
        const user = await this.authService.validateUser(username, password);
        if (!user) {
            throw new common_1.UnauthorizedException('用户名或密码错误');
        }
        return user;
    }
};
exports.LocalStrategy = LocalStrategy;
exports.LocalStrategy = LocalStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], LocalStrategy);


/***/ }),

/***/ "./src/modules/carbon/carbon.controller.ts":
/*!*************************************************!*\
  !*** ./src/modules/carbon/carbon.controller.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CarbonController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const carbon_service_1 = __webpack_require__(/*! ./carbon.service */ "./src/modules/carbon/carbon.service.ts");
let CarbonController = class CarbonController {
    constructor(carbonService) {
        this.carbonService = carbonService;
    }
    async getEmissions() {
        return this.carbonService.getEmissions();
    }
    async getEmissionFactors() {
        return this.carbonService.getEmissionFactors();
    }
};
exports.CarbonController = CarbonController;
__decorate([
    (0, common_1.Get)('emissions'),
    (0, swagger_1.ApiOperation)({ summary: '获取碳排放数据' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '成功获取碳排放数据' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CarbonController.prototype, "getEmissions", null);
__decorate([
    (0, common_1.Get)('factors'),
    (0, swagger_1.ApiOperation)({ summary: '获取排放因子' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '成功获取排放因子' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CarbonController.prototype, "getEmissionFactors", null);
exports.CarbonController = CarbonController = __decorate([
    (0, swagger_1.ApiTags)('碳排放管理'),
    (0, common_1.Controller)('carbon'),
    __metadata("design:paramtypes", [typeof (_a = typeof carbon_service_1.CarbonService !== "undefined" && carbon_service_1.CarbonService) === "function" ? _a : Object])
], CarbonController);


/***/ }),

/***/ "./src/modules/carbon/carbon.module.ts":
/*!*********************************************!*\
  !*** ./src/modules/carbon/carbon.module.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CarbonModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const carbon_controller_1 = __webpack_require__(/*! ./carbon.controller */ "./src/modules/carbon/carbon.controller.ts");
const carbon_service_1 = __webpack_require__(/*! ./carbon.service */ "./src/modules/carbon/carbon.service.ts");
let CarbonModule = class CarbonModule {
};
exports.CarbonModule = CarbonModule;
exports.CarbonModule = CarbonModule = __decorate([
    (0, common_1.Module)({
        controllers: [carbon_controller_1.CarbonController],
        providers: [carbon_service_1.CarbonService],
        exports: [carbon_service_1.CarbonService],
    })
], CarbonModule);


/***/ }),

/***/ "./src/modules/carbon/carbon.service.ts":
/*!**********************************************!*\
  !*** ./src/modules/carbon/carbon.service.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CarbonService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let CarbonService = class CarbonService {
    async getEmissions() {
        return {
            total: 1250.5,
            sources: [
                { name: '电力消耗', value: 850.3, percentage: 68.0 },
                { name: '制冷剂泄漏', value: 250.8, percentage: 20.1 },
                { name: '运输车辆', value: 149.4, percentage: 11.9 },
            ],
            monthly: [
                { month: '2024-01', electricity: 280.5, refrigerant: 85.2, transport: 45.8 },
                { month: '2024-02', electricity: 295.1, refrigerant: 82.6, transport: 48.3 },
                { month: '2024-03', electricity: 274.7, refrigerant: 83.0, transport: 55.3 },
            ],
        };
    }
    async getEmissionFactors() {
        return {
            electricity: 0.5703,
            refrigerants: {
                R404A: 3922,
                R134a: 1430,
                R507A: 3985,
            },
            transport: {
                diesel: 2.68,
                gasoline: 2.30,
            },
        };
    }
    async calculateEmissions(energyConsumption, refrigerantLeakage, fuelConsumption) {
        const factors = await this.getEmissionFactors();
        const electricityEmissions = (energyConsumption / 1000) * factors.electricity;
        const refrigerantEmissions = (refrigerantLeakage * factors.refrigerants.R404A) / 1000;
        const transportEmissions = (fuelConsumption * factors.transport.diesel) / 1000;
        return {
            electricity: Number(electricityEmissions.toFixed(2)),
            refrigerant: Number(refrigerantEmissions.toFixed(2)),
            transport: Number(transportEmissions.toFixed(2)),
            total: Number((electricityEmissions + refrigerantEmissions + transportEmissions).toFixed(2)),
        };
    }
};
exports.CarbonService = CarbonService;
exports.CarbonService = CarbonService = __decorate([
    (0, common_1.Injectable)()
], CarbonService);


/***/ }),

/***/ "./src/modules/dashboard/dashboard.controller.ts":
/*!*******************************************************!*\
  !*** ./src/modules/dashboard/dashboard.controller.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const dashboard_service_1 = __webpack_require__(/*! ./dashboard.service */ "./src/modules/dashboard/dashboard.service.ts");
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getOverview() {
        return this.dashboardService.getOverview();
    }
    async getStats() {
        return this.dashboardService.getStats();
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('overview'),
    (0, swagger_1.ApiOperation)({ summary: '获取仪表板概览数据' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '成功获取概览数据' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: '获取统计数据' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '成功获取统计数据' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getStats", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('仪表板'),
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [typeof (_a = typeof dashboard_service_1.DashboardService !== "undefined" && dashboard_service_1.DashboardService) === "function" ? _a : Object])
], DashboardController);


/***/ }),

/***/ "./src/modules/dashboard/dashboard.module.ts":
/*!***************************************************!*\
  !*** ./src/modules/dashboard/dashboard.module.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const dashboard_controller_1 = __webpack_require__(/*! ./dashboard.controller */ "./src/modules/dashboard/dashboard.controller.ts");
const dashboard_service_1 = __webpack_require__(/*! ./dashboard.service */ "./src/modules/dashboard/dashboard.service.ts");
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({
        controllers: [dashboard_controller_1.DashboardController],
        providers: [dashboard_service_1.DashboardService],
        exports: [dashboard_service_1.DashboardService],
    })
], DashboardModule);


/***/ }),

/***/ "./src/modules/dashboard/dashboard.service.ts":
/*!****************************************************!*\
  !*** ./src/modules/dashboard/dashboard.service.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let DashboardService = class DashboardService {
    async getOverview() {
        return {
            totalEmissions: 1250.5,
            monthlyEmissions: 125.3,
            energyConsumption: 8500,
            warehouseCount: 12,
            alertCount: 3,
            efficiency: 85.2,
        };
    }
    async getStats() {
        return {
            emissionTrend: [
                { date: '2024-01', value: 120.5 },
                { date: '2024-02', value: 135.2 },
                { date: '2024-03', value: 125.3 },
            ],
            energyTrend: [
                { date: '2024-01', value: 8200 },
                { date: '2024-02', value: 8800 },
                { date: '2024-03', value: 8500 },
            ],
            warehouseStatus: [
                { name: '冷库A', temperature: -18.5, humidity: 85.2, status: 'normal' },
                { name: '冷库B', temperature: -20.1, humidity: 82.8, status: 'normal' },
                { name: '冷库C', temperature: -15.8, humidity: 88.5, status: 'warning' },
            ],
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)()
], DashboardService);


/***/ }),

/***/ "./src/modules/logistics/logistics.controller.ts":
/*!*******************************************************!*\
  !*** ./src/modules/logistics/logistics.controller.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogisticsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const logistics_service_1 = __webpack_require__(/*! ./logistics.service */ "./src/modules/logistics/logistics.service.ts");
let LogisticsController = class LogisticsController {
    constructor(logisticsService) {
        this.logisticsService = logisticsService;
    }
    async getVehicles() {
        return this.logisticsService.getVehicles();
    }
    async getRoutes() {
        return this.logisticsService.getRoutes();
    }
};
exports.LogisticsController = LogisticsController;
__decorate([
    (0, common_1.Get)('vehicles'),
    (0, swagger_1.ApiOperation)({ summary: '获取车辆列表' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '成功获取车辆列表' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LogisticsController.prototype, "getVehicles", null);
__decorate([
    (0, common_1.Get)('routes'),
    (0, swagger_1.ApiOperation)({ summary: '获取运输路线' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '成功获取运输路线' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LogisticsController.prototype, "getRoutes", null);
exports.LogisticsController = LogisticsController = __decorate([
    (0, swagger_1.ApiTags)('物流管理'),
    (0, common_1.Controller)('logistics'),
    __metadata("design:paramtypes", [typeof (_a = typeof logistics_service_1.LogisticsService !== "undefined" && logistics_service_1.LogisticsService) === "function" ? _a : Object])
], LogisticsController);


/***/ }),

/***/ "./src/modules/logistics/logistics.module.ts":
/*!***************************************************!*\
  !*** ./src/modules/logistics/logistics.module.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogisticsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const logistics_controller_1 = __webpack_require__(/*! ./logistics.controller */ "./src/modules/logistics/logistics.controller.ts");
const logistics_service_1 = __webpack_require__(/*! ./logistics.service */ "./src/modules/logistics/logistics.service.ts");
let LogisticsModule = class LogisticsModule {
};
exports.LogisticsModule = LogisticsModule;
exports.LogisticsModule = LogisticsModule = __decorate([
    (0, common_1.Module)({
        controllers: [logistics_controller_1.LogisticsController],
        providers: [logistics_service_1.LogisticsService],
        exports: [logistics_service_1.LogisticsService],
    })
], LogisticsModule);


/***/ }),

/***/ "./src/modules/logistics/logistics.service.ts":
/*!****************************************************!*\
  !*** ./src/modules/logistics/logistics.service.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogisticsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let LogisticsService = class LogisticsService {
    async getVehicles() {
        return [
            {
                id: 1,
                plateNumber: '京A12345',
                type: '冷藏车',
                capacity: 10,
                fuelType: 'diesel',
                status: 'active',
                currentLocation: '园区A',
                fuelConsumption: 25.5,
                emissions: 68.4,
            },
            {
                id: 2,
                plateNumber: '京B67890',
                type: '冷藏车',
                capacity: 15,
                fuelType: 'diesel',
                status: 'active',
                currentLocation: '配送中',
                fuelConsumption: 32.1,
                emissions: 86.0,
            },
            {
                id: 3,
                plateNumber: '京C11111',
                type: '冷藏车',
                capacity: 8,
                fuelType: 'electric',
                status: 'maintenance',
                currentLocation: '维修站',
                fuelConsumption: 0,
                emissions: 0,
            },
        ];
    }
    async getRoutes() {
        return [
            {
                id: 1,
                name: '园区A -> 配送点1',
                distance: 25.5,
                duration: 45,
                vehicleId: 1,
                status: 'completed',
                emissions: 17.2,
                startTime: '2024-01-15T08:00:00Z',
                endTime: '2024-01-15T08:45:00Z',
            },
            {
                id: 2,
                name: '园区B -> 配送点2',
                distance: 18.3,
                duration: 35,
                vehicleId: 2,
                status: 'in_progress',
                emissions: 12.4,
                startTime: '2024-01-15T09:00:00Z',
                endTime: null,
            },
            {
                id: 3,
                name: '园区A -> 配送点3',
                distance: 32.1,
                duration: 55,
                vehicleId: 1,
                status: 'planned',
                emissions: 21.7,
                startTime: '2024-01-15T14:00:00Z',
                endTime: null,
            },
        ];
    }
    async optimizeRoutes(destinations) {
        return {
            optimizedRoute: destinations,
            totalDistance: 85.2,
            totalTime: 180,
            fuelSaved: 5.2,
            emissionReduction: 13.9,
        };
    }
};
exports.LogisticsService = LogisticsService;
exports.LogisticsService = LogisticsService = __decorate([
    (0, common_1.Injectable)()
], LogisticsService);


/***/ }),

/***/ "./src/modules/warehouse/warehouse.controller.ts":
/*!*******************************************************!*\
  !*** ./src/modules/warehouse/warehouse.controller.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WarehouseController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const warehouse_service_1 = __webpack_require__(/*! ./warehouse.service */ "./src/modules/warehouse/warehouse.service.ts");
let WarehouseController = class WarehouseController {
    constructor(warehouseService) {
        this.warehouseService = warehouseService;
    }
    async getWarehouses() {
        return this.warehouseService.getWarehouses();
    }
    async getMonitoringData() {
        return this.warehouseService.getMonitoringData();
    }
};
exports.WarehouseController = WarehouseController;
__decorate([
    (0, common_1.Get)('list'),
    (0, swagger_1.ApiOperation)({ summary: '获取冷库列表' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '成功获取冷库列表' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WarehouseController.prototype, "getWarehouses", null);
__decorate([
    (0, common_1.Get)('monitoring'),
    (0, swagger_1.ApiOperation)({ summary: '获取监控数据' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '成功获取监控数据' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WarehouseController.prototype, "getMonitoringData", null);
exports.WarehouseController = WarehouseController = __decorate([
    (0, swagger_1.ApiTags)('冷库管理'),
    (0, common_1.Controller)('warehouse'),
    __metadata("design:paramtypes", [typeof (_a = typeof warehouse_service_1.WarehouseService !== "undefined" && warehouse_service_1.WarehouseService) === "function" ? _a : Object])
], WarehouseController);


/***/ }),

/***/ "./src/modules/warehouse/warehouse.module.ts":
/*!***************************************************!*\
  !*** ./src/modules/warehouse/warehouse.module.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WarehouseModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const warehouse_controller_1 = __webpack_require__(/*! ./warehouse.controller */ "./src/modules/warehouse/warehouse.controller.ts");
const warehouse_service_1 = __webpack_require__(/*! ./warehouse.service */ "./src/modules/warehouse/warehouse.service.ts");
let WarehouseModule = class WarehouseModule {
};
exports.WarehouseModule = WarehouseModule;
exports.WarehouseModule = WarehouseModule = __decorate([
    (0, common_1.Module)({
        controllers: [warehouse_controller_1.WarehouseController],
        providers: [warehouse_service_1.WarehouseService],
        exports: [warehouse_service_1.WarehouseService],
    })
], WarehouseModule);


/***/ }),

/***/ "./src/modules/warehouse/warehouse.service.ts":
/*!****************************************************!*\
  !*** ./src/modules/warehouse/warehouse.service.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WarehouseService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let WarehouseService = class WarehouseService {
    async getWarehouses() {
        return [
            {
                id: 1,
                name: '冷库A',
                location: '园区东区',
                capacity: 5000,
                temperature: -18.5,
                humidity: 85.2,
                status: 'normal',
                energyConsumption: 2850,
            },
            {
                id: 2,
                name: '冷库B',
                location: '园区西区',
                capacity: 3000,
                temperature: -20.1,
                humidity: 82.8,
                status: 'normal',
                energyConsumption: 2150,
            },
            {
                id: 3,
                name: '冷库C',
                location: '园区南区',
                capacity: 4000,
                temperature: -15.8,
                humidity: 88.5,
                status: 'warning',
                energyConsumption: 3200,
            },
        ];
    }
    async getMonitoringData() {
        return {
            realtime: {
                totalEnergy: 8200,
                avgTemperature: -18.1,
                avgHumidity: 85.5,
                alertCount: 2,
            },
            trends: {
                temperature: [
                    { time: '00:00', value: -18.2 },
                    { time: '06:00', value: -18.5 },
                    { time: '12:00', value: -17.8 },
                    { time: '18:00', value: -18.1 },
                ],
                energy: [
                    { time: '00:00', value: 850 },
                    { time: '06:00', value: 920 },
                    { time: '12:00', value: 1050 },
                    { time: '18:00', value: 980 },
                ],
            },
            alerts: [
                {
                    id: 1,
                    warehouse: '冷库C',
                    type: 'temperature',
                    message: '温度超出正常范围',
                    level: 'warning',
                    timestamp: new Date().toISOString(),
                },
                {
                    id: 2,
                    warehouse: '冷库A',
                    type: 'humidity',
                    message: '湿度偏高',
                    level: 'info',
                    timestamp: new Date().toISOString(),
                },
            ],
        };
    }
};
exports.WarehouseService = WarehouseService;
exports.WarehouseService = WarehouseService = __decorate([
    (0, common_1.Injectable)()
], WarehouseService);


/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/passport":
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/schedule":
/*!***********************************!*\
  !*** external "@nestjs/schedule" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ }),

/***/ "@nestjs/swagger":
/*!**********************************!*\
  !*** external "@nestjs/swagger" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),

/***/ "@nestjs/typeorm":
/*!**********************************!*\
  !*** external "@nestjs/typeorm" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@nestjs/typeorm");

/***/ }),

/***/ "compression":
/*!******************************!*\
  !*** external "compression" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("compression");

/***/ }),

/***/ "express-rate-limit":
/*!*************************************!*\
  !*** external "express-rate-limit" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("express-rate-limit");

/***/ }),

/***/ "helmet":
/*!*************************!*\
  !*** external "helmet" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),

/***/ "nest-winston":
/*!*******************************!*\
  !*** external "nest-winston" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("nest-winston");

/***/ }),

/***/ "passport-jwt":
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),

/***/ "passport-local":
/*!*********************************!*\
  !*** external "passport-local" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("passport-local");

/***/ }),

/***/ "rxjs/operators":
/*!*********************************!*\
  !*** external "rxjs/operators" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("rxjs/operators");

/***/ }),

/***/ "typeorm":
/*!**************************!*\
  !*** external "typeorm" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("typeorm");

/***/ }),

/***/ "winston":
/*!**************************!*\
  !*** external "winston" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("winston");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const helmet_1 = __webpack_require__(/*! helmet */ "helmet");
const compression = __webpack_require__(/*! compression */ "compression");
const express_rate_limit_1 = __webpack_require__(/*! express-rate-limit */ "express-rate-limit");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./src/app.module.ts");
const http_exception_filter_1 = __webpack_require__(/*! ./common/filters/http-exception.filter */ "./src/common/filters/http-exception.filter.ts");
const transform_interceptor_1 = __webpack_require__(/*! ./common/interceptors/transform.interceptor */ "./src/common/interceptors/transform.interceptor.ts");
const logging_interceptor_1 = __webpack_require__(/*! ./common/interceptors/logging.interceptor */ "./src/common/interceptors/logging.interceptor.ts");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.use((0, helmet_1.default)());
    app.use(compression());
    app.use((0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: '请求过于频繁，请稍后再试',
    }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(), new transform_interceptor_1.TransformInterceptor());
    app.enableCors({
        origin: configService.get('FRONTEND_URL', 'http://localhost:3000'),
        credentials: true,
    });
    app.setGlobalPrefix('api/v1');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('冷库碳排放监测管理系统 API')
        .setDescription('冷库物流园区碳排放检测管理系统的后端API文档')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .addTag('认证管理', '用户认证相关接口')
        .addTag('仪表板', '仪表板数据接口')
        .addTag('碳排放管理', '碳排放监测与管理接口')
        .addTag('冷库管理', '冷库信息与监控接口')
        .addTag('物流管理', '物流运输管理接口')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
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

})();

/******/ })()
;