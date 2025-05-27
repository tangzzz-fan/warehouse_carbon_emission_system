import { Injectable } from '@nestjs/common';

@Injectable()
export class WarehouseService {
    /**
     * 获取冷库列表
     */
    async getWarehouses() {
        // TODO: 实现真实的冷库数据获取逻辑
        return [
            {
                id: 1,
                name: '冷库A',
                location: '园区东区',
                capacity: 5000, // 容量 (m³)
                temperature: -18.5, // 当前温度 (°C)
                humidity: 85.2, // 当前湿度 (%)
                status: 'normal', // 状态: normal, warning, error
                energyConsumption: 2850, // 能耗 (kWh)
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

    /**
     * 获取监控数据
     */
    async getMonitoringData() {
        // TODO: 实现真实的监控数据获取逻辑
        return {
            realtime: {
                totalEnergy: 8200, // 总能耗 (kWh)
                avgTemperature: -18.1, // 平均温度 (°C)
                avgHumidity: 85.5, // 平均湿度 (%)
                alertCount: 2, // 告警数量
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
} 