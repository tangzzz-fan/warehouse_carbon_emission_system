# 冷库物流园区碳排放检测管理系统 - 架构文档

## 系统架构概览

本系统采用前后端分离的微服务架构，提供冷库物流园区的碳排放检测、监控和管理功能。

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端应用       │    │   后端API       │    │   数据服务       │
│   (React)       │◄──►│   (NestJS)      │◄──►│   (FastAPI)     │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 8000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   用户界面       │    │   业务逻辑       │    │   数据分析       │
│   路由管理       │    │   API网关        │    │   机器学习       │
│   状态管理       │    │   认证授权       │    │   数据处理       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                    ┌─────────────────┐    ┌─────────────────┐
                    │   PostgreSQL    │    │     Redis       │
                    │   主数据库       │    │     缓存        │
                    │   Port: 5432    │    │   Port: 6379    │
                    └─────────────────┘    └─────────────────┘
```

## 技术栈

### 前端 (Frontend)
- **框架**: React 18.2.0
- **语言**: TypeScript 4.9.5
- **UI库**: Ant Design 5.12.8
- **路由**: React Router 6.20.1
- **HTTP客户端**: Axios 1.6.2
- **状态管理**: Zustand 4.4.7
- **图表库**: @ant-design/charts 2.0.3
- **构建工具**: React Scripts 5.0.1

### 后端 (Backend)
- **框架**: NestJS 10.x
- **语言**: TypeScript
- **数据库ORM**: TypeORM
- **认证**: JWT + Passport
- **API文档**: Swagger/OpenAPI
- **验证**: class-validator
- **日志**: Winston
- **缓存**: Redis
- **任务调度**: @nestjs/schedule

### 数据服务 (Data Service)
- **框架**: FastAPI
- **语言**: Python 3.9+
- **数据库**: SQLAlchemy 2.0+
- **数据分析**: Pandas, NumPy
- **机器学习**: Scikit-learn
- **异步**: asyncio, aiofiles
- **API文档**: 自动生成OpenAPI

### 数据库
- **主数据库**: PostgreSQL 15+
- **缓存**: Redis 7+
- **连接池**: pgbouncer (可选)

### 基础设施
- **容器化**: Docker + Docker Compose
- **反向代理**: Nginx (生产环境)
- **监控**: Prometheus + Grafana (计划中)
- **日志**: ELK Stack (计划中)

## 核心模块架构

### 1. 用户认证模块 (Auth Module)
```
认证流程:
用户登录 → JWT Token → 权限验证 → 资源访问
```

**技术实现**:
- JWT Token 认证
- RBAC 权限控制
- 密码加密 (bcrypt)
- 会话管理

### 2. 仪表板模块 (Dashboard Module)
```
数据流:
传感器数据 → 数据处理 → 实时计算 → 可视化展示
```

**功能特性**:
- 实时数据监控
- 统计图表展示
- 告警信息汇总
- 系统状态概览

### 3. 碳排放管理模块 (Carbon Module)
```
计算流程:
活动数据 → 排放因子 → 碳排放计算 → 结果存储 → 报告生成
```

**核心功能**:
- 碳排放数据采集
- 排放因子管理
- 碳足迹计算引擎
- 减排目标跟踪

### 4. 冷库管理模块 (Warehouse Module)
```
监控体系:
温湿度传感器 → 数据采集 → 异常检测 → 告警通知
```

**管理功能**:
- 冷库信息管理
- 温湿度监控
- 能耗统计分析
- 设备状态管理

### 5. 物流管理模块 (Logistics Module)
```
优化流程:
路线规划 → 运输调度 → 实时跟踪 → 碳排放计算
```

**核心能力**:
- 车辆信息管理
- 运输路线优化
- 燃料消耗统计
- 运输碳排放计算

## 数据架构

### 数据模型设计

#### 用户与权限
```sql
users (用户表)
├── id (主键)
├── username (用户名)
├── email (邮箱)
├── password_hash (密码哈希)
├── role_id (角色ID)
└── created_at (创建时间)

roles (角色表)
├── id (主键)
├── name (角色名称)
├── permissions (权限列表)
└── description (描述)
```

#### 碳排放数据
```sql
carbon_emissions (碳排放记录)
├── id (主键)
├── source_type (排放源类型)
├── source_id (排放源ID)
├── emission_value (排放量)
├── unit (单位)
├── calculation_method (计算方法)
├── recorded_at (记录时间)
└── created_at (创建时间)

emission_factors (排放因子)
├── id (主键)
├── category (类别)
├── subcategory (子类别)
├── factor_value (因子值)
├── unit (单位)
├── source (数据来源)
└── valid_from (生效时间)
```

#### 冷库监控
```sql
warehouses (冷库信息)
├── id (主键)
├── name (冷库名称)
├── location (位置)
├── capacity (容量)
├── temperature_range (温度范围)
└── status (状态)

monitoring_data (监控数据)
├── id (主键)
├── warehouse_id (冷库ID)
├── temperature (温度)
├── humidity (湿度)
├── energy_consumption (能耗)
├── recorded_at (记录时间)
└── sensor_id (传感器ID)
```

#### 物流运输
```sql
vehicles (车辆信息)
├── id (主键)
├── license_plate (车牌号)
├── vehicle_type (车辆类型)
├── fuel_type (燃料类型)
├── capacity (载重量)
└── status (状态)

transport_routes (运输路线)
├── id (主键)
├── vehicle_id (车辆ID)
├── origin (起点)
├── destination (终点)
├── distance (距离)
├── fuel_consumption (燃料消耗)
├── carbon_emission (碳排放)
└── completed_at (完成时间)
```

## API 架构

### RESTful API 设计原则

#### 统一响应格式
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
  code?: number;
}
```

#### 错误处理
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}
```

### API 端点设计

#### 认证相关
```
POST /api/v1/auth/login      # 用户登录
POST /api/v1/auth/register   # 用户注册
POST /api/v1/auth/refresh    # 刷新Token
POST /api/v1/auth/logout     # 用户登出
```

#### 仪表板
```
GET /api/v1/dashboard/overview    # 系统概览
GET /api/v1/dashboard/stats       # 统计数据
GET /api/v1/dashboard/alerts      # 告警信息
```

#### 碳排放管理
```
GET    /api/v1/carbon/emissions        # 获取排放数据
POST   /api/v1/carbon/emissions        # 创建排放记录
GET    /api/v1/carbon/factors          # 获取排放因子
PUT    /api/v1/carbon/factors/:id      # 更新排放因子
GET    /api/v1/carbon/reports          # 生成报告
```

#### 冷库管理
```
GET    /api/v1/warehouse/list          # 冷库列表
GET    /api/v1/warehouse/:id           # 冷库详情
GET    /api/v1/warehouse/monitoring    # 监控数据
POST   /api/v1/warehouse/alerts        # 创建告警
```

#### 物流管理
```
GET    /api/v1/logistics/vehicles      # 车辆列表
POST   /api/v1/logistics/vehicles      # 添加车辆
GET    /api/v1/logistics/routes        # 路线列表
POST   /api/v1/logistics/routes        # 创建路线
GET    /api/v1/logistics/optimize      # 路线优化
```

## 安全架构

### 认证与授权
- **JWT Token**: 无状态认证
- **RBAC**: 基于角色的访问控制
- **API Key**: 服务间认证
- **HTTPS**: 传输层加密

### 数据安全
- **数据加密**: 敏感数据加密存储
- **SQL注入防护**: 参数化查询
- **XSS防护**: 输入验证和输出编码
- **CSRF防护**: Token验证

### 网络安全
- **防火墙**: 端口访问控制
- **限流**: API请求频率限制
- **监控**: 异常访问检测
- **日志**: 安全事件记录

## 性能优化

### 前端优化
- **代码分割**: 路由级别懒加载
- **缓存策略**: HTTP缓存 + Service Worker
- **资源优化**: 图片压缩、CDN加速
- **虚拟滚动**: 大数据量表格优化

### 后端优化
- **数据库优化**: 索引优化、查询优化
- **缓存策略**: Redis缓存热点数据
- **连接池**: 数据库连接池管理
- **异步处理**: 耗时任务异步执行

### 数据库优化
- **索引设计**: 合理创建索引
- **分区表**: 大表分区存储
- **读写分离**: 主从数据库架构
- **数据归档**: 历史数据归档策略

## 监控与运维

### 应用监控
- **健康检查**: 服务健康状态监控
- **性能指标**: 响应时间、吞吐量
- **错误追踪**: 异常日志收集
- **业务指标**: 关键业务数据监控

### 基础设施监控
- **服务器监控**: CPU、内存、磁盘
- **网络监控**: 带宽、延迟、丢包
- **数据库监控**: 连接数、查询性能
- **缓存监控**: Redis性能指标

### 日志管理
- **结构化日志**: JSON格式日志
- **日志聚合**: 集中式日志收集
- **日志分析**: 关键词搜索、趋势分析
- **告警机制**: 异常日志告警

## 部署架构

### 开发环境
```
本地开发 → Docker Compose → 本地测试
```

### 测试环境
```
代码提交 → CI/CD Pipeline → 自动化测试 → 部署测试环境
```

### 生产环境
```
代码审核 → 构建镜像 → 容器编排 → 滚动更新 → 监控告警
```

### 容器化部署
- **Docker**: 应用容器化
- **Docker Compose**: 本地开发环境
- **Kubernetes**: 生产环境编排 (计划中)
- **Helm**: 应用包管理 (计划中)

## 扩展性设计

### 水平扩展
- **无状态设计**: 应用服务无状态
- **负载均衡**: 多实例负载分发
- **数据库分片**: 数据水平分片
- **缓存集群**: Redis集群部署

### 垂直扩展
- **资源配置**: CPU、内存动态调整
- **存储扩展**: 磁盘容量扩展
- **网络优化**: 带宽升级
- **数据库优化**: 性能调优

## 未来规划

### 技术演进
- **微服务架构**: 服务进一步拆分
- **事件驱动**: 基于事件的架构
- **GraphQL**: API查询优化
- **WebAssembly**: 前端性能优化

### 功能扩展
- **AI/ML集成**: 智能预测分析
- **IoT集成**: 物联网设备接入
- **区块链**: 碳排放数据溯源
- **移动端**: 移动应用开发

### 运维升级
- **DevOps**: 完整CI/CD流程
- **GitOps**: 基于Git的运维
- **服务网格**: Istio服务治理
- **可观测性**: 全链路追踪

---

*本文档将随着项目发展持续更新，记录架构演进过程和最佳实践。* 