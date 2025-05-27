import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WarehouseService } from './warehouse.service';

@ApiTags('冷库管理')
@Controller('warehouse')
export class WarehouseController {
    constructor(private readonly warehouseService: WarehouseService) { }

    @Get('list')
    @ApiOperation({ summary: '获取冷库列表' })
    @ApiResponse({ status: 200, description: '成功获取冷库列表' })
    async getWarehouses() {
        return this.warehouseService.getWarehouses();
    }

    @Get('monitoring')
    @ApiOperation({ summary: '获取监控数据' })
    @ApiResponse({ status: 200, description: '成功获取监控数据' })
    async getMonitoringData() {
        return this.warehouseService.getMonitoringData();
    }
} 