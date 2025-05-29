# 冷库物流园区碳排放检测管理系统 - API 接口规范

## 概述

本文档定义了冷库物流园区碳排放检测管理系统的标准 REST API 接口规范，包括请求/响应格式、数据模型定义、错误处理等。

## API 设计原则

- 遵循 RESTful API 设计规范
- 统一使用 JSON 格式进行数据交换
- 支持分页查询，使用 `page` 和 `limit` 参数
- 统一的错误响应格式
- 支持字段过滤和排序
- 所有时间字段使用 ISO 8601 格式
- 使用 HTTP 状态码表示操作结果

## 通用数据结构

### 响应格式

#### 成功响应
```typescript
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
}
```

#### 错误响应
```typescript
interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}
```

#### 分页响应
```typescript
interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}
```

### 通用查询参数
```typescript
interface QueryParams {
  page?: number;          // 页码，默认 1
  limit?: number;         // 每页数量，默认 20
  sort?: string;          // 排序字段
  order?: 'asc' | 'desc'; // 排序方向，默认 desc
  search?: string;        // 搜索关键词
  filters?: Record<string, any>; // 过滤条件
}
```

## 数据模型定义

### 1. 用户认证模块

#### 用户信息
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  realName?: string;
  phone?: string;
  avatarUrl?: string;
  status: 1 | 0 | -1; // 1:正常 0:禁用 -1:删除
  lastLoginAt?: string;
  lastLoginIp?: string;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}

interface Role {
  id: string;
  code: string;
  name: string;
  description?: string;
  permissions: Permission[];
}

interface Permission {
  id: string;
  code: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
}
```

#### 登录相关
```typescript
interface LoginRequest {
  username: string;
  password: string;
  captcha?: string;
}

interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

interface RefreshTokenRequest {
  refreshToken: string;
}
```

### 2. 冷库管理模块

#### 冷库信息
```typescript
interface Warehouse {
  id: string;
  code: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  totalArea?: number; // 平方米
  storageCapacity?: number; // 立方米
  buildYear?: number;
  managerId?: string;
  manager?: User;
  status: 1 | 0 | -1; // 1:运营中 0:维护中 -1:停用
  description?: string;
  zones: StorageZone[];
  equipment: Equipment[];
  createdAt: string;
  updatedAt: string;
}

interface StorageZone {
  id: string;
  warehouseId: string;
  code: string;
  name: string;
  zoneType: string; // 冷冻、冷藏、常温
  targetTemperature?: number;
  targetHumidity?: number;
  area?: number;
  capacity?: number;
  currentUsage: number;
  status: 1 | 0 | -1;
  createdAt: string;
  updatedAt: string;
}

interface Equipment {
  id: string;
  warehouseId: string;
  zoneId?: string;
  code: string;
  name: string;
  equipmentType: string;
  brand?: string;
  model?: string;
  powerRating?: number; // kW
  installDate?: string;
  warrantyUntil?: string;
  status: 1 | 0 | -1; // 1:正常 0:故障 -1:维护
  lastMaintenanceAt?: string;
  nextMaintenanceAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### 环境监控数据
```typescript
interface EnvironmentalData {
  id: string;
  warehouseId: string;
  zoneId?: string;
  equipmentId?: string;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  co2Level?: number;
  powerConsumption?: number; // kWh
  recordedAt: string;
  createdAt: string;
}

interface EnvironmentalDataQuery extends QueryParams {
  warehouseId?: string;
  zoneId?: string;
  equipmentId?: string;
  startTime?: string;
  endTime?: string;
  dataType?: 'temperature' | 'humidity' | 'pressure' | 'co2' | 'power';
}
```

### 3. 碳排放管理模块

#### 排放源和因子
```typescript
interface EmissionSource {
  id: string;
  code: string;
  name: string;
  sourceType: 'electricity' | 'fuel' | 'refrigerant' | 'transport';
  category: 'scope1' | 'scope2' | 'scope3';
  unit: string;
  description?: string;
  isActive: boolean;
  factors: EmissionFactor[];
  createdAt: string;
  updatedAt: string;
}

interface EmissionFactor {
  id: string;
  sourceId: string;
  region?: string;
  factorValue: number;
  unit: string;
  effectiveFrom: string;
  effectiveTo?: string;
  sourceReference?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### 碳排放记录
```typescript
interface CarbonEmission {
  id: string;
  warehouseId: string;
  warehouse?: Warehouse;
  sourceId: string;
  source?: EmissionSource;
  factorId: string;
  factor?: EmissionFactor;
  activityData: number;
  emissionAmount: number; // tCO2e
  calculationMethod?: string;
  recordDate: string;
  dataQuality: 'measured' | 'estimated' | 'default';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface CarbonEmissionQuery extends QueryParams {
  warehouseId?: string;
  sourceId?: string;
  startDate?: string;
  endDate?: string;
  dataQuality?: string;
}

interface CarbonEmissionSummary {
  totalEmission: number;
  scope1Emission: number;
  scope2Emission: number;
  scope3Emission: number;
  emissionBySource: Array<{
    sourceId: string;
    sourceName: string;
    emission: number;
    percentage: number;
  }>;
  emissionTrend: Array<{
    date: string;
    emission: number;
  }>;
}
```

#### 减排目标
```typescript
interface EmissionTarget {
  id: string;
  warehouseId?: string;
  targetType: 'absolute' | 'intensity';
  baselineYear: number;
  baselineEmission: number;
  targetYear: number;
  targetEmission: number;
  reductionPercentage?: number;
  status: 'active' | 'achieved' | 'expired';
  createdAt: string;
  updatedAt: string;
}
```

### 4. 物流管理模块

#### 货物和库存
```typescript
interface CargoType {
  id: string;
  code: string;
  name: string;
  category: string; // 冷冻、冷藏、常温
  temperatureRangeMin?: number;
  temperatureRangeMax?: number;
  humidityRequirement?: number;
  specialRequirements?: string;
  createdAt: string;
  updatedAt: string;
}

interface Inventory {
  id: string;
  warehouseId: string;
  warehouse?: Warehouse;
  zoneId: string;
  zone?: StorageZone;
  cargoTypeId: string;
  cargoType?: CargoType;
  batchNo?: string;
  quantity: number;
  unit: string;
  entryDate: string;
  expiryDate?: string;
  temperatureAtEntry?: number;
  supplierName?: string;
  status: 'stored' | 'reserved' | 'shipped';
  createdAt: string;
  updatedAt: string;
}
```

#### 车辆和运输
```typescript
interface Vehicle {
  id: string;
  licensePlate: string;
  vehicleType: string;
  brand?: string;
  model?: string;
  capacity?: number; // 吨
  fuelType: 'diesel' | 'gasoline' | 'electric' | 'hybrid';
  fuelConsumption?: number; // L/100km
  co2EmissionFactor?: number;
  driverId?: string;
  driver?: User;
  status: 1 | 0 | -1;
  createdAt: string;
  updatedAt: string;
}

interface TransportRecord {
  id: string;
  vehicleId: string;
  vehicle?: Vehicle;
  driverId: string;
  driver?: User;
  originWarehouseId?: string;
  originWarehouse?: Warehouse;
  destinationWarehouseId?: string;
  destinationWarehouse?: Warehouse;
  originAddress?: string;
  destinationAddress?: string;
  distance?: number; // 公里
  fuelConsumed?: number;
  transportEmission?: number;
  departureTime?: string;
  arrivalTime?: string;
  cargoWeight?: number;
  temperatureMaintained: boolean;
  status: 'planned' | 'in_transit' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 5. 告警与通知模块

#### 告警规则和记录
```typescript
interface AlertRule {
  id: string;
  name: string;
  ruleType: 'temperature' | 'humidity' | 'emission' | 'equipment';
  warehouseId?: string;
  zoneId?: string;
  equipmentId?: string;
  conditionField: string;
  operator: '>' | '<' | '>=' | '<=' | '=' | '!=';
  thresholdValue: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
  notificationMethods: string[];
  createdAt: string;
  updatedAt: string;
}

interface Alert {
  id: string;
  ruleId: string;
  rule?: AlertRule;
  warehouseId?: string;
  warehouse?: Warehouse;
  zoneId?: string;
  zone?: StorageZone;
  equipmentId?: string;
  equipment?: Equipment;
  alertType: string;
  severity: string;
  title: string;
  message: string;
  currentValue?: number;
  thresholdValue?: number;
  status: 'active' | 'acknowledged' | 'resolved';
  triggeredAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
}

interface Notification {
  id: string;
  alertId?: string;
  userId?: string;
  notificationType: 'email' | 'sms' | 'push' | 'system';
  title: string;
  content: string;
  recipient: string;
  status: 'pending' | 'sent' | 'failed' | 'read';
  sentAt?: string;
  readAt?: string;
  errorMessage?: string;
  createdAt: string;
}
```

### 6. 仪表板数据

#### 仪表板概览
```typescript
interface DashboardOverview {
  totalWarehouses: number;
  totalEmission: number;
  monthlyEmission: number;
  emissionChange: number; // 相比上月百分比变化
  activeAlerts: number;
  energyConsumption: number;
  energyEfficiency: number;
  averageTemperature: number;
}

interface DashboardChartData {
  emissionTrend: Array<{
    date: string;
    emission: number;
    target?: number;
  }>;
  energyConsumption: Array<{
    date: string;
    consumption: number;
  }>;
  temperatureDistribution: Array<{
    warehouseId: string;
    warehouseName: string;
    zones: Array<{
      zoneId: string;
      zoneName: string;
      temperature: number;
      status: 'normal' | 'warning' | 'alarm';
    }>;
  }>;
  alertStatistics: Array<{
    severity: string;
    count: number;
  }>;
}
```

## API 接口定义

### 1. 认证接口

#### POST /api/auth/login
用户登录
```typescript
// Request
{
  "username": "admin",
  "password": "password123"
}

// Response
{
  "success": true,
  "data": {
    "user": User,
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here",
    "expiresIn": 3600
  }
}
```

#### POST /api/auth/logout
用户登出
```typescript
// Request: Headers with Authorization: Bearer {token}

// Response
{
  "success": true,
  "message": "Logout successful"
}
```

#### POST /api/auth/refresh
刷新令牌
```typescript
// Request
{
  "refreshToken": "refresh_token_here"
}

// Response
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "expiresIn": 3600
  }
}
```

### 2. 用户管理接口

#### GET /api/users
获取用户列表
```typescript
// Query: ?page=1&limit=20&search=keyword&role=admin

// Response
PaginatedResponse<User>
```

#### GET /api/users/:id
获取用户详情
```typescript
// Response
ApiResponse<User>
```

#### POST /api/users
创建用户
```typescript
// Request
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "realName": "张三",
  "phone": "13800138000",
  "roleIds": ["role-uuid-1", "role-uuid-2"]
}

// Response
ApiResponse<User>
```

#### PUT /api/users/:id
更新用户
```typescript
// Request
{
  "realName": "李四",
  "phone": "13900139000"
}

// Response
ApiResponse<User>
```

#### DELETE /api/users/:id
删除用户
```typescript
// Response
ApiResponse<null>
```

### 3. 冷库管理接口

#### GET /api/warehouses
获取冷库列表
```typescript
// Query: ?page=1&limit=20&status=1&search=keyword

// Response
PaginatedResponse<Warehouse>
```

#### GET /api/warehouses/:id
获取冷库详情
```typescript
// Response
ApiResponse<Warehouse>
```

#### POST /api/warehouses
创建冷库
```typescript
// Request
{
  "code": "WH001",
  "name": "一号冷库",
  "address": "北京市朝阳区xxx",
  "totalArea": 1000,
  "storageCapacity": 5000,
  "managerId": "user-uuid"
}

// Response
ApiResponse<Warehouse>
```

#### GET /api/warehouses/:id/zones
获取冷库存储区域
```typescript
// Response
ApiResponse<StorageZone[]>
```

#### GET /api/warehouses/:id/equipment
获取冷库设备列表
```typescript
// Response
ApiResponse<Equipment[]>
```

#### GET /api/warehouses/:id/environmental-data
获取环境监控数据
```typescript
// Query: ?startTime=2024-01-01T00:00:00Z&endTime=2024-01-31T23:59:59Z&dataType=temperature

// Response
PaginatedResponse<EnvironmentalData>
```

### 4. 碳排放管理接口

#### GET /api/carbon-emissions
获取碳排放记录
```typescript
// Query: ?warehouseId=uuid&startDate=2024-01-01&endDate=2024-01-31

// Response
PaginatedResponse<CarbonEmission>
```

#### GET /api/carbon-emissions/summary
获取碳排放汇总数据
```typescript
// Query: ?warehouseId=uuid&year=2024

// Response
ApiResponse<CarbonEmissionSummary>
```

#### POST /api/carbon-emissions
创建碳排放记录
```typescript
// Request
{
  "warehouseId": "warehouse-uuid",
  "sourceId": "source-uuid",
  "factorId": "factor-uuid",
  "activityData": 1000.5,
  "recordDate": "2024-01-15",
  "dataQuality": "measured"
}

// Response
ApiResponse<CarbonEmission>
```

#### GET /api/emission-sources
获取排放源列表
```typescript
// Response
ApiResponse<EmissionSource[]>
```

#### GET /api/emission-factors
获取排放因子列表
```typescript
// Query: ?sourceId=uuid&region=beijing

// Response
ApiResponse<EmissionFactor[]>
```

### 5. 物流管理接口

#### GET /api/inventory
获取库存列表
```typescript
// Query: ?warehouseId=uuid&zoneId=uuid&status=stored

// Response
PaginatedResponse<Inventory>
```

#### POST /api/inventory
创建库存记录
```typescript
// Request
{
  "warehouseId": "warehouse-uuid",
  "zoneId": "zone-uuid",
  "cargoTypeId": "cargo-type-uuid",
  "quantity": 100,
  "unit": "吨",
  "entryDate": "2024-01-15",
  "supplierName": "供应商A"
}

// Response
ApiResponse<Inventory>
```

#### GET /api/vehicles
获取车辆列表
```typescript
// Response
PaginatedResponse<Vehicle>
```

#### GET /api/transport-records
获取运输记录
```typescript
// Query: ?vehicleId=uuid&status=completed&startDate=2024-01-01

// Response
PaginatedResponse<TransportRecord>
```

### 6. 告警管理接口

#### GET /api/alerts
获取告警列表
```typescript
// Query: ?status=active&severity=high&warehouseId=uuid

// Response
PaginatedResponse<Alert>
```

#### PUT /api/alerts/:id/acknowledge
确认告警
```typescript
// Response
ApiResponse<Alert>
```

#### PUT /api/alerts/:id/resolve
解决告警
```typescript
// Request
{
  "resolutionNote": "已处理，温度恢复正常"
}

// Response
ApiResponse<Alert>
```

#### GET /api/alert-rules
获取告警规则列表
```typescript
// Response
ApiResponse<AlertRule[]>
```

#### POST /api/alert-rules
创建告警规则
```typescript
// Request
{
  "name": "冷库温度过高告警",
  "ruleType": "temperature",
  "warehouseId": "warehouse-uuid",
  "conditionField": "temperature",
  "operator": ">",
  "thresholdValue": 5.0,
  "severity": "high",
  "notificationMethods": ["email", "sms"]
}

// Response
ApiResponse<AlertRule>
```

### 7. 仪表板接口

#### GET /api/dashboard/overview
获取仪表板概览数据
```typescript
// Query: ?warehouseId=uuid (可选，不传则获取全部)

// Response
ApiResponse<DashboardOverview>
```

#### GET /api/dashboard/charts
获取仪表板图表数据
```typescript
// Query: ?type=emission&period=month&warehouseId=uuid

// Response
ApiResponse<DashboardChartData>
```

## Mock 数据服务接口标识

为了便于前端开发，以下接口可以使用 Mock 数据：

### 🎭 可 Mock 的接口列表

#### 基础数据接口 (优先 Mock)
- `GET /api/users` - 用户列表
- `GET /api/warehouses` - 冷库列表
- `GET /api/warehouses/:id/zones` - 存储区域
- `GET /api/warehouses/:id/equipment` - 设备列表
- `GET /api/emission-sources` - 排放源列表
- `GET /api/emission-factors` - 排放因子列表
- `GET /api/cargo-types` - 货物类型列表
- `GET /api/vehicles` - 车辆列表

#### 业务数据接口 (建议 Mock)
- `GET /api/warehouses/:id/environmental-data` - 环境监控数据
- `GET /api/carbon-emissions` - 碳排放记录
- `GET /api/carbon-emissions/summary` - 碳排放汇总
- `GET /api/inventory` - 库存数据
- `GET /api/transport-records` - 运输记录
- `GET /api/alerts` - 告警数据
- `GET /api/dashboard/overview` - 仪表板概览
- `GET /api/dashboard/charts` - 图表数据

#### 认证接口 (简化 Mock)
- `POST /api/auth/login` - 登录 (返回固定 token)
- `POST /api/auth/refresh` - 刷新令牌
- `GET /api/auth/profile` - 当前用户信息

### Mock 数据生成规则

1. **时间数据**: 使用相对时间，如最近 30 天、近 12 个月
2. **数值数据**: 使用合理的随机范围，符合业务逻辑
3. **状态数据**: 覆盖所有可能的状态值
4. **关联数据**: 保持数据间的逻辑一致性
5. **分页数据**: 支持标准分页参数

### Mock 数据示例

```typescript
// 环境监控数据 Mock 示例
const mockEnvironmentalData = {
  success: true,
  data: Array.from({ length: 100 }, (_, i) => ({
    id: `env-${i}`,
    warehouseId: "warehouse-1",
    zoneId: "zone-1",
    temperature: -18 + Math.random() * 2, // -18°C ± 1°C
    humidity: 85 + Math.random() * 10,    // 85-95%
    powerConsumption: 50 + Math.random() * 20, // 50-70 kWh
    recordedAt: new Date(Date.now() - i * 60000).toISOString(), // 每分钟一个数据点
    createdAt: new Date().toISOString()
  })),
  pagination: {
    page: 1,
    limit: 20,
    total: 100,
    totalPages: 5
  }
};
```

## 错误处理

### HTTP 状态码
- `200` - 请求成功
- `201` - 创建成功
- `400` - 请求参数错误
- `401` - 未授权
- `403` - 权限不足
- `404` - 资源不存在
- `409` - 资源冲突
- `422` - 验证失败
- `500` - 服务器内部错误

### 错误码定义
```typescript
enum ErrorCodes {
  // 认证相关
  AUTH_INVALID_CREDENTIALS = 'AUTH_001',
  AUTH_TOKEN_EXPIRED = 'AUTH_002',
  AUTH_INSUFFICIENT_PERMISSIONS = 'AUTH_003',
  
  // 业务相关
  WAREHOUSE_NOT_FOUND = 'WH_001',
  EQUIPMENT_OFFLINE = 'EQ_001',
  TEMPERATURE_OUT_OF_RANGE = 'TEMP_001',
  EMISSION_CALCULATION_ERROR = 'EM_001',
  
  // 系统相关
  VALIDATION_ERROR = 'SYS_001',
  DATABASE_ERROR = 'SYS_002',
  EXTERNAL_SERVICE_ERROR = 'SYS_003'
}
```

## 版本控制

API 版本通过 URL 路径进行管理：
- `v1`: `/api/v1/...` (当前版本)
- `v2`: `/api/v2/...` (未来版本)

## 认证授权

### JWT Token 格式
```typescript
interface JwtPayload {
  sub: string;      // 用户ID
  username: string; // 用户名
  roles: string[];  // 角色列表
  permissions: string[]; // 权限列表
  iat: number;      // 签发时间
  exp: number;      // 过期时间
}
```

### 权限验证
请求头携带认证信息：
```
Authorization: Bearer <jwt_token>
```

## 数据验证

### 请求数据验证规则
- 必填字段验证
- 数据类型验证
- 数据范围验证
- 格式验证 (邮箱、手机号等)
- 业务规则验证 (温度范围、排放因子有效性等)

### 响应数据规范
- 数值字段保留指定小数位
- 时间字段统一 ISO 8601 格式
- 枚举值使用预定义常量
- 空值字段可选返回

---

本 API 规范为系统开发提供统一的接口标准，前端和后端开发团队应严格遵循此规范进行开发。 