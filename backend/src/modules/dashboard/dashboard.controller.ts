import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('仪表板')
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('overview')
    @ApiOperation({ summary: '获取仪表板概览数据' })
    @ApiResponse({ status: 200, description: '成功获取概览数据' })
    async getOverview() {
        return this.dashboardService.getOverview();
    }

    @Get('stats')
    @ApiOperation({ summary: '获取统计数据' })
    @ApiResponse({ status: 200, description: '成功获取统计数据' })
    async getStats() {
        return this.dashboardService.getStats();
    }
} 