# 冷库物流园区碳排放检测管理系统 - 数据库设计

## 概述

本文档定义了冷库物流园区碳排放检测管理系统的完整数据库结构，包括所有核心业务表、字段定义、约束条件和关系。

## 数据库设计原则

- 使用 PostgreSQL 作为主数据库
- 所有表名使用小写下划线命名 (snake_case)
- 主键统一使用 `id` 字段，类型为 UUID
- 时间字段统一使用 `created_at`、`updated_at`、`deleted_at`
- 软删除支持，使用 `deleted_at` 字段
- 所有金额字段使用 DECIMAL 类型，精度为 (15,2)
- 温度字段精度为 (5,1)，支持 -999.9 到 9999.9°C
- 碳排放量字段精度为 (15,3)，单位为 CO2e 吨

## 1. 用户认证与权限管理模块

### 1.1 用户表 (users)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    real_name VARCHAR(100),
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    status SMALLINT DEFAULT 1, -- 1:正常 0:禁用 -1:删除
    last_login_at TIMESTAMP,
    last_login_ip INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);
```

### 1.2 角色表 (roles)
```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE, -- 是否系统预设角色
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);
```

### 1.3 权限表 (permissions)
```sql
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    resource VARCHAR(50) NOT NULL, -- 资源类型
    action VARCHAR(50) NOT NULL, -- 操作类型
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 1.4 用户角色关联表 (user_roles)
```sql
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    role_id UUID NOT NULL REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, role_id)
);
```

### 1.5 角色权限关联表 (role_permissions)
```sql
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id),
    permission_id UUID NOT NULL REFERENCES permissions(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);
```

### 1.6 操作日志表 (audit_logs)
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 2. 冷库管理模块

### 2.1 冷库信息表 (warehouses)
```sql
CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    address TEXT,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    total_area DECIMAL(10,2), -- 总面积 (平方米)
    storage_capacity DECIMAL(12,2), -- 存储容量 (立方米)
    build_year INTEGER,
    manager_id UUID REFERENCES users(id),
    status SMALLINT DEFAULT 1, -- 1:运营中 0:维护中 -1:停用
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);
```

### 2.2 存储区域表 (storage_zones)
```sql
CREATE TABLE storage_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    zone_type VARCHAR(50) NOT NULL, -- 区域类型：冷冻、冷藏、常温
    target_temperature DECIMAL(5,1), -- 目标温度
    target_humidity DECIMAL(5,1), -- 目标湿度
    area DECIMAL(10,2), -- 区域面积
    capacity DECIMAL(12,2), -- 存储容量
    current_usage DECIMAL(12,2) DEFAULT 0, -- 当前使用量
    status SMALLINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    UNIQUE(warehouse_id, code)
);
```

### 2.3 设备信息表 (equipment)
```sql
CREATE TABLE equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    zone_id UUID REFERENCES storage_zones(id),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    equipment_type VARCHAR(50) NOT NULL, -- 设备类型：制冷机、传感器、压缩机等
    brand VARCHAR(100),
    model VARCHAR(100),
    power_rating DECIMAL(10,2), -- 额定功率 (kW)
    install_date DATE,
    warranty_until DATE,
    status SMALLINT DEFAULT 1, -- 1:正常 0:故障 -1:维护
    last_maintenance_at TIMESTAMP,
    next_maintenance_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    UNIQUE(warehouse_id, code)
);
```

### 2.4 环境监控数据表 (environmental_data)
```sql
CREATE TABLE environmental_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    zone_id UUID REFERENCES storage_zones(id),
    equipment_id UUID REFERENCES equipment(id),
    temperature DECIMAL(5,1), -- 温度
    humidity DECIMAL(5,1), -- 湿度
    pressure DECIMAL(8,2), -- 压力
    co2_level DECIMAL(8,2), -- CO2浓度
    power_consumption DECIMAL(10,3), -- 电力消耗 (kWh)
    recorded_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建时间索引提高查询性能
CREATE INDEX idx_environmental_data_recorded_at ON environmental_data(recorded_at);
CREATE INDEX idx_environmental_data_warehouse_recorded ON environmental_data(warehouse_id, recorded_at);
```

## 3. 碳排放管理模块

### 3.1 排放源配置表 (emission_sources)
```sql
CREATE TABLE emission_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    source_type VARCHAR(50) NOT NULL, -- 排放源类型：electricity, fuel, refrigerant, transport
    category VARCHAR(50) NOT NULL, -- 范围分类：scope1, scope2, scope3
    unit VARCHAR(20) NOT NULL, -- 计量单位
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.2 排放因子表 (emission_factors)
```sql
CREATE TABLE emission_factors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES emission_sources(id),
    region VARCHAR(50), -- 地区
    factor_value DECIMAL(15,6) NOT NULL, -- 排放因子值
    unit VARCHAR(20) NOT NULL, -- 单位 (kg CO2e/kWh, kg CO2e/L 等)
    effective_from DATE NOT NULL,
    effective_to DATE,
    source_reference TEXT, -- 数据来源
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.3 碳排放记录表 (carbon_emissions)
```sql
CREATE TABLE carbon_emissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    source_id UUID NOT NULL REFERENCES emission_sources(id),
    factor_id UUID NOT NULL REFERENCES emission_factors(id),
    activity_data DECIMAL(15,3) NOT NULL, -- 活动数据量
    emission_amount DECIMAL(15,3) NOT NULL, -- 排放量 (tCO2e)
    calculation_method VARCHAR(100), -- 计算方法
    record_date DATE NOT NULL,
    data_quality VARCHAR(20) DEFAULT 'measured', -- 数据质量：measured, estimated, default
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_carbon_emissions_warehouse_date ON carbon_emissions(warehouse_id, record_date);
```

### 3.4 碳减排目标表 (emission_targets)
```sql
CREATE TABLE emission_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse_id UUID REFERENCES warehouses(id),
    target_type VARCHAR(50) NOT NULL, -- 目标类型：absolute, intensity
    baseline_year INTEGER NOT NULL,
    baseline_emission DECIMAL(15,3) NOT NULL,
    target_year INTEGER NOT NULL,
    target_emission DECIMAL(15,3) NOT NULL,
    reduction_percentage DECIMAL(5,2), -- 减排百分比
    status VARCHAR(20) DEFAULT 'active', -- active, achieved, expired
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 4. 物流管理模块

### 4.1 货物类型表 (cargo_types)
```sql
CREATE TABLE cargo_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 货物分类：冷冻、冷藏、常温
    temperature_range_min DECIMAL(5,1),
    temperature_range_max DECIMAL(5,1),
    humidity_requirement DECIMAL(5,1),
    special_requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.2 货物库存表 (inventory)
```sql
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    zone_id UUID NOT NULL REFERENCES storage_zones(id),
    cargo_type_id UUID NOT NULL REFERENCES cargo_types(id),
    batch_no VARCHAR(100),
    quantity DECIMAL(12,3) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    entry_date DATE NOT NULL,
    expiry_date DATE,
    temperature_at_entry DECIMAL(5,1),
    supplier_name VARCHAR(200),
    status VARCHAR(20) DEFAULT 'stored', -- stored, reserved, shipped
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.3 车辆信息表 (vehicles)
```sql
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL, -- 车辆类型：冷藏车、普通货车
    brand VARCHAR(50),
    model VARCHAR(50),
    capacity DECIMAL(10,2), -- 载重量 (吨)
    fuel_type VARCHAR(20) NOT NULL, -- 燃料类型：diesel, gasoline, electric, hybrid
    fuel_consumption DECIMAL(8,2), -- 油耗 (L/100km)
    co2_emission_factor DECIMAL(10,6), -- CO2排放因子
    driver_id UUID REFERENCES users(id),
    status SMALLINT DEFAULT 1, -- 1:可用 0:维护 -1:停用
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);
```

### 4.4 运输记录表 (transport_records)
```sql
CREATE TABLE transport_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    driver_id UUID NOT NULL REFERENCES users(id),
    origin_warehouse_id UUID REFERENCES warehouses(id),
    destination_warehouse_id UUID REFERENCES warehouses(id),
    origin_address TEXT,
    destination_address TEXT,
    distance DECIMAL(10,2), -- 距离 (公里)
    fuel_consumed DECIMAL(10,3), -- 燃料消耗
    transport_emission DECIMAL(10,3), -- 运输排放量
    departure_time TIMESTAMP,
    arrival_time TIMESTAMP,
    cargo_weight DECIMAL(10,2), -- 货物重量
    temperature_maintained BOOLEAN DEFAULT TRUE, -- 是否保持冷链
    status VARCHAR(20) DEFAULT 'planned', -- planned, in_transit, completed, cancelled
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 5. 告警与通知模块

### 5.1 告警规则表 (alert_rules)
```sql
CREATE TABLE alert_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    rule_type VARCHAR(50) NOT NULL, -- temperature, humidity, emission, equipment
    warehouse_id UUID REFERENCES warehouses(id),
    zone_id UUID REFERENCES storage_zones(id),
    equipment_id UUID REFERENCES equipment(id),
    condition_field VARCHAR(50) NOT NULL, -- 监控字段
    operator VARCHAR(10) NOT NULL, -- >, <, >=, <=, =, !=
    threshold_value DECIMAL(15,3) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    is_active BOOLEAN DEFAULT TRUE,
    notification_methods TEXT[], -- 通知方式数组
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5.2 告警记录表 (alerts)
```sql
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id UUID NOT NULL REFERENCES alert_rules(id),
    warehouse_id UUID REFERENCES warehouses(id),
    zone_id UUID REFERENCES storage_zones(id),
    equipment_id UUID REFERENCES equipment(id),
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    current_value DECIMAL(15,3),
    threshold_value DECIMAL(15,3),
    status VARCHAR(20) DEFAULT 'active', -- active, acknowledged, resolved
    triggered_at TIMESTAMP NOT NULL,
    acknowledged_at TIMESTAMP,
    acknowledged_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP,
    resolved_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_status_triggered ON alerts(status, triggered_at);
```

### 5.3 通知记录表 (notifications)
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID REFERENCES alerts(id),
    user_id UUID REFERENCES users(id),
    notification_type VARCHAR(50) NOT NULL, -- email, sms, push, system
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    recipient VARCHAR(200) NOT NULL, -- 接收者地址
    status VARCHAR(20) DEFAULT 'pending', -- pending, sent, failed, read
    sent_at TIMESTAMP,
    read_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 6. 系统配置模块

### 6.1 系统配置表 (system_configs)
```sql
CREATE TABLE system_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    config_type VARCHAR(20) NOT NULL, -- string, number, boolean, json
    category VARCHAR(50) NOT NULL,
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    is_editable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6.2 数据字典表 (dictionaries)
```sql
CREATE TABLE dictionaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dict_type VARCHAR(50) NOT NULL,
    dict_key VARCHAR(100) NOT NULL,
    dict_value VARCHAR(200) NOT NULL,
    dict_label VARCHAR(200) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(dict_type, dict_key)
);
```

## 7. 数据分析与报表模块

### 7.1 报表模板表 (report_templates)
```sql
CREATE TABLE report_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    template_type VARCHAR(50) NOT NULL, -- carbon_emission, energy_consumption, temperature
    description TEXT,
    config JSONB NOT NULL, -- 报表配置信息
    is_system BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7.2 报表生成记录表 (report_generations)
```sql
CREATE TABLE report_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES report_templates(id),
    name VARCHAR(100) NOT NULL,
    parameters JSONB, -- 报表参数
    file_path VARCHAR(500), -- 生成的文件路径
    file_size BIGINT, -- 文件大小
    status VARCHAR(20) DEFAULT 'pending', -- pending, generating, completed, failed
    generated_by UUID NOT NULL REFERENCES users(id),
    error_message TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 索引优化

```sql
-- 性能优化索引
CREATE INDEX idx_environmental_data_composite ON environmental_data(warehouse_id, zone_id, recorded_at);
CREATE INDEX idx_carbon_emissions_composite ON carbon_emissions(warehouse_id, record_date, source_id);
CREATE INDEX idx_alerts_warehouse_status ON alerts(warehouse_id, status, triggered_at);
CREATE INDEX idx_transport_records_vehicle_time ON transport_records(vehicle_id, departure_time);
CREATE INDEX idx_audit_logs_user_action ON audit_logs(user_id, action, created_at);

-- 全文搜索索引
CREATE INDEX idx_warehouses_search ON warehouses USING gin(to_tsvector('simple', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_equipment_search ON equipment USING gin(to_tsvector('simple', name || ' ' || brand || ' ' || model));
```

## 数据分区策略

```sql
-- 环境数据按月分区 (PostgreSQL 10+)
CREATE TABLE environmental_data_partitioned (
    LIKE environmental_data INCLUDING ALL
) PARTITION BY RANGE (recorded_at);

-- 创建月度分区表
CREATE TABLE environmental_data_y2024m01 PARTITION OF environmental_data_partitioned
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- 碳排放数据按年分区
CREATE TABLE carbon_emissions_partitioned (
    LIKE carbon_emissions INCLUDING ALL
) PARTITION BY RANGE (record_date);
```

## 备注

1. 所有表都包含 `created_at`、`updated_at` 时间戳
2. 重要业务表支持软删除 (`deleted_at`)
3. 使用 UUID 作为主键，便于分布式部署
4. 敏感数据字段需要在应用层加密
5. 大数据量表建议分区存储
6. 定期清理历史数据，保持查询性能 