import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LogisticsService } from './logistics.service';

@ApiTags('物流管理')
@Controller('logistics')
export class LogisticsController {
    constructor(private readonly logisticsService: LogisticsService) { }

    @Get('vehicles')
    @ApiOperation({ summary: '获取车辆列表' })
    @ApiResponse({ status: 200, description: '成功获取车辆列表' })
    async getVehicles() {
        return this.logisticsService.getVehicles();
    }

    @Get('routes')
    @ApiOperation({ summary: '获取运输路线' })
    @ApiResponse({ status: 200, description: '成功获取运输路线' })
    async getRoutes() {
        return this.logisticsService.getRoutes();
    }
} 