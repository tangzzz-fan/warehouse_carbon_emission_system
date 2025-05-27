import { Injectable } from '@nestjs/common';

@Injectable()
export class CarbonService {
    /**
     * 获取碳排放数据
     */
    async getEmissions() {
        // TODO: 实现真实的碳排放数据获取逻辑
        return {
            total: 1250.5, // 总排放量 (tCO2e)
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

    /**
     * 获取排放因子
     */
    async getEmissionFactors() {
        // TODO: 实现真实的排放因子数据获取逻辑
        return {
            electricity: 0.5703, // 电力排放因子 (tCO2e/MWh)
            refrigerants: {
                R404A: 3922, // GWP值
                R134a: 1430,
                R507A: 3985,
            },
            transport: {
                diesel: 2.68, // 柴油排放因子 (kgCO2e/L)
                gasoline: 2.30, // 汽油排放因子 (kgCO2e/L)
            },
        };
    }

    /**
     * 计算碳排放量
     * @param energyConsumption 能耗数据 (kWh)
     * @param refrigerantLeakage 制冷剂泄漏量 (kg)
     * @param fuelConsumption 燃料消耗量 (L)
     */
    async calculateEmissions(
        energyConsumption: number,
        refrigerantLeakage: number,
        fuelConsumption: number,
    ) {
        const factors = await this.getEmissionFactors();

        // 电力排放计算
        const electricityEmissions = (energyConsumption / 1000) * factors.electricity;

        // 制冷剂排放计算 (假设使用R404A)
        const refrigerantEmissions = (refrigerantLeakage * factors.refrigerants.R404A) / 1000;

        // 运输排放计算 (假设使用柴油)
        const transportEmissions = (fuelConsumption * factors.transport.diesel) / 1000;

        return {
            electricity: Number(electricityEmissions.toFixed(2)),
            refrigerant: Number(refrigerantEmissions.toFixed(2)),
            transport: Number(transportEmissions.toFixed(2)),
            total: Number((electricityEmissions + refrigerantEmissions + transportEmissions).toFixed(2)),
        };
    }
} 