# 冷库物流园区碳排放检测管理系统 - Mock 数据规范

## 概述

本文档定义了系统开发阶段前端使用的 Mock 数据服务规范，用于解决前端与后端开发的时间差问题，确保前端开发能够独立进行。

## Mock 数据服务架构

### 技术选型
- **Mock 工具**: MSW (Mock Service Worker) 或 JSON Server
- **数据生成**: Faker.js 用于生成真实感数据
- **时间处理**: Day.js 用于时间数据生成
- **数据持久化**: LocalStorage 存储 Mock 数据状态

### 目录结构
```
frontend/src/mock/
├── data/               # Mock 数据文件
│   ├── users.ts       # 用户数据
│   ├── warehouses.ts  # 冷库数据
│   ├── emissions.ts   # 碳排放数据
│   ├── logistics.ts   # 物流数据
│   └── alerts.ts      # 告警数据
├── handlers/          # API 处理器
│   ├── auth.ts       # 认证接口
│   ├── users.ts      # 用户管理
│   ├── warehouses.ts # 冷库管理
│   ├── emissions.ts  # 碳排放管理
│   ├── logistics.ts  # 物流管理
│   ├── alerts.ts     # 告警管理
│   └── dashboard.ts  # 仪表板
├── utils/             # 工具函数
│   ├── generator.ts  # 数据生成器
│   ├── response.ts   # 响应格式化
│   └── storage.ts    # 数据存储
├── browser.ts         # 浏览器 Mock 配置
└── index.ts          # Mock 服务入口
```

## Mock 数据生成规则

### 1. 基础数据规则

#### 用户数据
```typescript
// mock/data/users.ts
import { faker } from '@faker-js/faker';

export const generateMockUsers = (count: number = 50) => {
  return Array.from({ length: count }, (_, index) => ({
    id: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    realName: faker.person.fullName('zh_CN'),
    phone: faker.phone.number('1##########'),
    avatarUrl: faker.image.avatar(),
    status: faker.helpers.arrayElement([1, 1, 1, 0, -1]), // 权重：正常多，其他少
    lastLoginAt: faker.date.recent({ days: 30 }).toISOString(),
    lastLoginIp: faker.internet.ip(),
    roles: [
      {
        id: faker.string.uuid(),
        code: faker.helpers.arrayElement(['admin', 'manager', 'operator', 'viewer']),
        name: faker.helpers.arrayElement(['系统管理员', '园区管理员', '操作员', '查看者']),
        description: '角色描述',
        permissions: []
      }
    ],
    createdAt: faker.date.past({ years: 2 }).toISOString(),
    updatedAt: faker.date.recent({ days: 7 }).toISOString()
  }));
};
```

#### 冷库数据
```typescript
// mock/data/warehouses.ts
export const generateMockWarehouses = (count: number = 10) => {
  return Array.from({ length: count }, (_, index) => ({
    id: faker.string.uuid(),
    code: `WH${String(index + 1).padStart(3, '0')}`,
    name: `${faker.helpers.arrayElement(['东区', '西区', '南区', '北区'])}${index + 1}号冷库`,
    address: faker.location.streetAddress(),
    latitude: faker.location.latitude({ min: 39.8, max: 40.0 }), // 北京地区
    longitude: faker.location.longitude({ min: 116.3, max: 116.5 }),
    totalArea: faker.number.int({ min: 500, max: 5000 }), // 500-5000平方米
    storageCapacity: faker.number.int({ min: 1000, max: 20000 }), // 1000-20000立方米
    buildYear: faker.number.int({ min: 2015, max: 2023 }),
    managerId: faker.string.uuid(),
    status: faker.helpers.arrayElement([1, 1, 1, 0]), // 大部分运营中
    description: faker.lorem.sentence(),
    zones: generateMockStorageZones(faker.number.int({ min: 3, max: 8 })),
    equipment: generateMockEquipment(faker.number.int({ min: 5, max: 15 })),
    createdAt: faker.date.past({ years: 2 }).toISOString(),
    updatedAt: faker.date.recent({ days: 30 }).toISOString()
  }));
};

export const generateMockStorageZones = (count: number) => {
  const zoneTypes = ['冷冻区', '冷藏区', '常温区'];
  const temperatureMap = {
    '冷冻区': { min: -25, max: -15 },
    '冷藏区': { min: -5, max: 5 },
    '常温区': { min: 15, max: 25 }
  };

  return Array.from({ length: count }, (_, index) => {
    const zoneType = faker.helpers.arrayElement(zoneTypes);
    const tempRange = temperatureMap[zoneType];
    
    return {
      id: faker.string.uuid(),
      warehouseId: '', // 由父级填充
      code: `Z${String(index + 1).padStart(2, '0')}`,
      name: `${zoneType}-${index + 1}`,
      zoneType,
      targetTemperature: faker.number.float({ 
        min: tempRange.min, 
        max: tempRange.max, 
        precision: 0.1 
      }),
      targetHumidity: faker.number.float({ min: 80, max: 95, precision: 0.1 }),
      area: faker.number.int({ min: 50, max: 800 }),
      capacity: faker.number.int({ min: 100, max: 3000 }),
      currentUsage: faker.number.int({ min: 50, max: 2500 }),
      status: 1,
      createdAt: faker.date.past({ years: 1 }).toISOString(),
      updatedAt: faker.date.recent({ days: 15 }).toISOString()
    };
  });
};
```

#### 环境监控数据
```typescript
// mock/data/environmental.ts
export const generateMockEnvironmentalData = (
  warehouseId: string,
  zoneId: string,
  hoursBack: number = 24
) => {
  const now = new Date();
  const interval = 5; // 5分钟间隔
  const dataPoints = (hoursBack * 60) / interval;

  return Array.from({ length: dataPoints }, (_, index) => {
    const recordTime = new Date(now.getTime() - index * interval * 60000);
    
    // 根据区域类型生成合理的温度范围
    const baseTemp = faker.helpers.arrayElement([-20, -18, 2, 20]); // 不同区域基准温度
    const tempVariation = faker.number.float({ min: -1, max: 1, precision: 0.1 });
    
    return {
      id: faker.string.uuid(),
      warehouseId,
      zoneId,
      equipmentId: faker.string.uuid(),
      temperature: Number((baseTemp + tempVariation).toFixed(1)),
      humidity: faker.number.float({ min: 80, max: 95, precision: 0.1 }),
      pressure: faker.number.float({ min: 98, max: 102, precision: 0.01 }), // kPa
      co2Level: faker.number.float({ min: 400, max: 800, precision: 1 }), // ppm
      powerConsumption: faker.number.float({ min: 45, max: 85, precision: 0.1 }), // kWh
      recordedAt: recordTime.toISOString(),
      createdAt: recordTime.toISOString()
    };
  });
};
```

### 2. 业务数据规则

#### 碳排放数据
```typescript
// mock/data/emissions.ts
export const generateMockCarbonEmissions = (warehouseId: string, months: number = 12) => {
  const emissionSources = [
    { id: '1', name: '电力消耗', type: 'electricity', category: 'scope2' },
    { id: '2', name: '制冷剂泄漏', type: 'refrigerant', category: 'scope1' },
    { id: '3', name: '运输燃料', type: 'transport', category: 'scope3' },
    { id: '4', name: '天然气', type: 'fuel', category: 'scope1' }
  ];

  const emissions = [];
  const now = new Date();

  for (let month = 0; month < months; month++) {
    const recordDate = new Date(now.getFullYear(), now.getMonth() - month, 1);
    
    emissionSources.forEach(source => {
      // 根据排放源类型生成不同范围的数据
      let activityData, emissionAmount;
      
      switch (source.type) {
        case 'electricity':
          activityData = faker.number.float({ min: 10000, max: 50000, precision: 0.1 }); // kWh
          emissionAmount = activityData * 0.5839; // 中国电网平均排放因子
          break;
        case 'refrigerant':
          activityData = faker.number.float({ min: 0.1, max: 2.0, precision: 0.01 }); // kg
          emissionAmount = activityData * 1430; // R404A GWP值
          break;
        case 'transport':
          activityData = faker.number.float({ min: 500, max: 2000, precision: 0.1 }); // L
          emissionAmount = activityData * 2.68; // 柴油排放因子
          break;
        case 'fuel':
          activityData = faker.number.float({ min: 100, max: 800, precision: 0.1 }); // m³
          emissionAmount = activityData * 2.162; // 天然气排放因子
          break;
        default:
          activityData = 0;
          emissionAmount = 0;
      }

      emissions.push({
        id: faker.string.uuid(),
        warehouseId,
        sourceId: source.id,
        factorId: faker.string.uuid(),
        activityData: Number(activityData.toFixed(2)),
        emissionAmount: Number((emissionAmount / 1000).toFixed(3)), // 转换为吨
        calculationMethod: '排放因子法',
        recordDate: recordDate.toISOString().split('T')[0],
        dataQuality: faker.helpers.arrayElement(['measured', 'estimated', 'default']),
        notes: faker.lorem.sentence(),
        createdAt: faker.date.recent({ days: 30 }).toISOString(),
        updatedAt: faker.date.recent({ days: 7 }).toISOString()
      });
    });
  }

  return emissions;
};

export const generateMockEmissionSummary = (warehouseId: string) => {
  const scope1 = faker.number.float({ min: 50, max: 150, precision: 0.1 });
  const scope2 = faker.number.float({ min: 200, max: 500, precision: 0.1 });
  const scope3 = faker.number.float({ min: 30, max: 100, precision: 0.1 });
  const total = scope1 + scope2 + scope3;

  return {
    totalEmission: Number(total.toFixed(2)),
    scope1Emission: Number(scope1.toFixed(2)),
    scope2Emission: Number(scope2.toFixed(2)),
    scope3Emission: Number(scope3.toFixed(2)),
    emissionBySource: [
      { sourceId: '1', sourceName: '电力消耗', emission: scope2 * 0.8, percentage: 65 },
      { sourceId: '2', sourceName: '制冷剂泄漏', emission: scope1 * 0.6, percentage: 15 },
      { sourceId: '3', sourceName: '运输燃料', emission: scope3 * 0.7, percentage: 12 },
      { sourceId: '4', sourceName: '天然气', emission: scope1 * 0.4, percentage: 8 }
    ],
    emissionTrend: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i, 1).toISOString().split('T')[0],
      emission: faker.number.float({ min: 40, max: 80, precision: 0.1 })
    }))
  };
};
```

#### 告警数据
```typescript
// mock/data/alerts.ts
export const generateMockAlerts = (count: number = 50) => {
  const alertTypes = ['temperature', 'humidity', 'emission', 'equipment'];
  const severities = ['low', 'medium', 'high', 'critical'];
  const statuses = ['active', 'acknowledged', 'resolved'];

  return Array.from({ length: count }, () => {
    const severity = faker.helpers.arrayElement(severities);
    const status = faker.helpers.arrayElement(statuses);
    const alertType = faker.helpers.arrayElement(alertTypes);
    
    let title, message, currentValue, thresholdValue;
    
    switch (alertType) {
      case 'temperature':
        currentValue = faker.number.float({ min: -25, max: 10, precision: 0.1 });
        thresholdValue = faker.number.float({ min: -20, max: 5, precision: 0.1 });
        title = '温度异常告警';
        message = `冷库温度 ${currentValue}°C 超出阈值 ${thresholdValue}°C`;
        break;
      case 'humidity':
        currentValue = faker.number.float({ min: 70, max: 98, precision: 0.1 });
        thresholdValue = 90;
        title = '湿度异常告警';
        message = `湿度 ${currentValue}% 超出阈值 ${thresholdValue}%`;
        break;
      case 'emission':
        currentValue = faker.number.float({ min: 50, max: 200, precision: 0.1 });
        thresholdValue = 100;
        title = '碳排放超标告警';
        message = `碳排放量 ${currentValue}tCO2e 超出目标 ${thresholdValue}tCO2e`;
        break;
      case 'equipment':
        title = '设备故障告警';
        message = '制冷设备运行异常，请及时检查';
        break;
    }

    const triggeredAt = faker.date.recent({ days: 7 });
    
    return {
      id: faker.string.uuid(),
      ruleId: faker.string.uuid(),
      warehouseId: faker.string.uuid(),
      zoneId: faker.string.uuid(),
      equipmentId: faker.string.uuid(),
      alertType,
      severity,
      title,
      message,
      currentValue,
      thresholdValue,
      status,
      triggeredAt: triggeredAt.toISOString(),
      acknowledgedAt: status !== 'active' ? faker.date.between({ 
        from: triggeredAt, 
        to: new Date() 
      }).toISOString() : undefined,
      acknowledgedBy: status !== 'active' ? faker.string.uuid() : undefined,
      resolvedAt: status === 'resolved' ? faker.date.recent({ days: 1 }).toISOString() : undefined,
      resolvedBy: status === 'resolved' ? faker.string.uuid() : undefined,
      createdAt: triggeredAt.toISOString()
    };
  });
};
```

### 3. 仪表板数据

#### 概览数据
```typescript
// mock/data/dashboard.ts
export const generateMockDashboardOverview = () => ({
  totalWarehouses: faker.number.int({ min: 8, max: 15 }),
  totalEmission: faker.number.float({ min: 800, max: 1500, precision: 0.1 }), // tCO2e/年
  monthlyEmission: faker.number.float({ min: 60, max: 120, precision: 0.1 }), // tCO2e/月
  emissionChange: faker.number.float({ min: -15, max: 10, precision: 0.1 }), // 变化百分比
  activeAlerts: faker.number.int({ min: 3, max: 25 }),
  energyConsumption: faker.number.float({ min: 150000, max: 300000, precision: 0.1 }), // kWh/月
  energyEfficiency: faker.number.float({ min: 85, max: 95, precision: 0.1 }), // 能效百分比
  averageTemperature: faker.number.float({ min: -18, max: -15, precision: 0.1 }) // 平均温度
});

export const generateMockDashboardCharts = () => ({
  emissionTrend: Array.from({ length: 12 }, (_, i) => ({
    date: new Date(2024, i, 1).toISOString().split('T')[0],
    emission: faker.number.float({ min: 60, max: 120, precision: 0.1 }),
    target: 80 // 目标值
  })),
  energyConsumption: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    consumption: faker.number.float({ min: 8000, max: 15000, precision: 0.1 })
  })),
  temperatureDistribution: Array.from({ length: 5 }, (_, i) => ({
    warehouseId: `warehouse-${i + 1}`,
    warehouseName: `${i + 1}号冷库`,
    zones: Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, (_, j) => ({
      zoneId: `zone-${j + 1}`,
      zoneName: `${j + 1}区`,
      temperature: faker.number.float({ min: -22, max: -15, precision: 0.1 }),
      status: faker.helpers.arrayElement(['normal', 'normal', 'normal', 'warning', 'alarm'])
    }))
  })),
  alertStatistics: [
    { severity: 'critical', count: faker.number.int({ min: 0, max: 3 }) },
    { severity: 'high', count: faker.number.int({ min: 2, max: 8 }) },
    { severity: 'medium', count: faker.number.int({ min: 5, max: 15 }) },
    { severity: 'low', count: faker.number.int({ min: 10, max: 25 }) }
  ]
});
```

## Mock 接口处理器

### 认证处理器
```typescript
// mock/handlers/auth.ts
import { http, HttpResponse } from 'msw';

export const authHandlers = [
  // 登录
  http.post('/api/auth/login', async ({ request }) => {
    const { username, password } = await request.json();
    
    // 简单验证，实际可以更复杂
    if (username === 'admin' && password === 'admin123') {
      return HttpResponse.json({
        success: true,
        data: {
          user: {
            id: 'user-admin',
            username: 'admin',
            email: 'admin@example.com',
            realName: '系统管理员',
            roles: [{ code: 'admin', name: '超级管理员' }]
          },
          token: 'mock-jwt-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
          expiresIn: 3600
        },
        timestamp: new Date().toISOString()
      });
    }

    return HttpResponse.json({
      success: false,
      error: {
        code: 'AUTH_001',
        message: '用户名或密码错误'
      },
      timestamp: new Date().toISOString()
    }, { status: 401 });
  }),

  // 登出
  http.post('/api/auth/logout', () => {
    return HttpResponse.json({
      success: true,
      message: 'Logout successful',
      timestamp: new Date().toISOString()
    });
  }),

  // 刷新令牌
  http.post('/api/auth/refresh', async ({ request }) => {
    const { refreshToken } = await request.json();
    
    if (refreshToken && refreshToken.startsWith('mock-refresh-token-')) {
      return HttpResponse.json({
        success: true,
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          expiresIn: 3600
        },
        timestamp: new Date().toISOString()
      });
    }

    return HttpResponse.json({
      success: false,
      error: {
        code: 'AUTH_002',
        message: 'Invalid refresh token'
      },
      timestamp: new Date().toISOString()
    }, { status: 401 });
  })
];
```

### 分页处理器工具
```typescript
// mock/utils/response.ts
export const createPaginatedResponse = <T>(
  data: T[],
  page: number = 1,
  limit: number = 20
) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    success: true,
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: data.length,
      totalPages: Math.ceil(data.length / limit)
    },
    timestamp: new Date().toISOString()
  };
};

export const createApiResponse = <T>(data: T, message?: string) => ({
  success: true,
  data,
  message,
  timestamp: new Date().toISOString()
});

export const createApiError = (code: string, message: string, status: number = 400) => ({
  success: false,
  error: { code, message },
  timestamp: new Date().toISOString()
});
```

### 仪表板处理器
```typescript
// mock/handlers/dashboard.ts
import { http, HttpResponse } from 'msw';
import { generateMockDashboardOverview, generateMockDashboardCharts } from '../data/dashboard';
import { createApiResponse } from '../utils/response';

export const dashboardHandlers = [
  // 仪表板概览
  http.get('/api/dashboard/overview', ({ request }) => {
    const url = new URL(request.url);
    const warehouseId = url.searchParams.get('warehouseId');
    
    const overview = generateMockDashboardOverview();
    return HttpResponse.json(createApiResponse(overview));
  }),

  // 仪表板图表数据
  http.get('/api/dashboard/charts', ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const period = url.searchParams.get('period') || 'month';
    
    const charts = generateMockDashboardCharts();
    return HttpResponse.json(createApiResponse(charts));
  })
];
```

## Mock 服务配置

### 浏览器环境配置
```typescript
// mock/browser.ts
import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth';
import { warehouseHandlers } from './handlers/warehouses';
import { emissionHandlers } from './handlers/emissions';
import { dashboardHandlers } from './handlers/dashboard';
// ... 导入其他处理器

export const worker = setupWorker(
  ...authHandlers,
  ...warehouseHandlers,
  ...emissionHandlers,
  ...dashboardHandlers
  // ... 其他处理器
);

// 开发环境启动
if (process.env.NODE_ENV === 'development') {
  worker.start({
    onUnhandledRequest: 'bypass', // 未处理的请求直接通过
  });
}
```

### 环境变量控制
```typescript
// .env.development
REACT_APP_USE_MOCK=true
REACT_APP_API_BASE_URL=http://localhost:3000/api

// .env.production
REACT_APP_USE_MOCK=false
REACT_APP_API_BASE_URL=https://api.example.com/api
```

### API 客户端集成
```typescript
// src/services/api-client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 10000,
});

// 请求拦截器 - 添加认证头
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 - 处理错误
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // 清除认证信息，跳转登录
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## Mock 数据持久化

### LocalStorage 管理
```typescript
// mock/utils/storage.ts
class MockDataStorage {
  private prefix = 'mock-data-';

  set<T>(key: string, data: T): void {
    try {
      localStorage.setItem(
        this.prefix + key,
        JSON.stringify({
          data,
          timestamp: Date.now(),
          version: '1.0'
        })
      );
    } catch (error) {
      console.warn('Failed to save mock data to localStorage:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      const age = Date.now() - parsed.timestamp;
      
      // 数据过期时间 24 小时
      if (age > 24 * 60 * 60 * 1000) {
        this.remove(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.warn('Failed to load mock data from localStorage:', error);
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

export const mockStorage = new MockDataStorage();
```

## 开发工作流程

### 1. 前端开发阶段
1. 启用 Mock 服务 (`REACT_APP_USE_MOCK=true`)
2. 根据 API 规范开发页面组件
3. 使用 Mock 数据进行功能测试
4. 完善 Mock 数据以覆盖各种场景

### 2. 接口联调阶段
1. 部分关闭 Mock 服务，逐个接口切换到真实 API
2. 对比 Mock 数据与真实数据，调整前端代码
3. 处理真实 API 的异常情况

### 3. 生产部署阶段
1. 完全关闭 Mock 服务 (`REACT_APP_USE_MOCK=false`)
2. 移除 Mock 相关代码和依赖
3. 配置生产环境 API 地址

## Mock 数据质量保证

### 数据一致性检查
```typescript
// mock/utils/validator.ts
export const validateMockData = {
  // 检查关联数据完整性
  checkRelationships: (data: any[]) => {
    // 实现关联数据检查逻辑
  },
  
  // 检查数据格式
  checkFormat: (data: any, schema: any) => {
    // 实现数据格式验证
  },
  
  // 检查业务规则
  checkBusinessRules: (data: any) => {
    // 实现业务规则验证
  }
};
```

### 测试覆盖
- 覆盖所有 API 接口
- 覆盖所有响应状态码
- 覆盖各种异常场景
- 覆盖边界条件

### 性能考虑
- 合理控制 Mock 数据量
- 实现数据分页
- 避免过度复杂的数据生成逻辑
- 使用缓存减少重复计算

---

通过这套 Mock 数据规范，前端开发团队可以独立进行开发工作，不依赖后端接口的完成进度，大大提高开发效率。 