import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CarbonService } from './carbon.service';

@ApiTags('碳排放管理')
@Controller('carbon')
export class CarbonController {
    constructor(private readonly carbonService: CarbonService) { }

    @Get('emissions')
    @ApiOperation({ summary: '获取碳排放数据' })
    @ApiResponse({ status: 200, description: '成功获取碳排放数据' })
    async getEmissions() {
        return this.carbonService.getEmissions();
    }

    @Get('factors')
    @ApiOperation({ summary: '获取排放因子' })
    @ApiResponse({ status: 200, description: '成功获取排放因子' })
    async getEmissionFactors() {
        return this.carbonService.getEmissionFactors();
    }
} 