import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const WarehouseManagement: React.FC = () => {
    return (
        <div>
            <Title level={2}>冷库管理</Title>
            <Card>
                <p>冷库管理功能正在开发中...</p>
                <p>将包含：</p>
                <ul>
                    <li>冷库温湿度监控</li>
                    <li>能耗数据统计</li>
                    <li>设备状态管理</li>
                    <li>告警信息处理</li>
                </ul>
            </Card>
        </div>
    );
};

export default WarehouseManagement; 