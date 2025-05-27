import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const LogisticsManagement: React.FC = () => {
    return (
        <div>
            <Title level={2}>物流管理</Title>
            <Card>
                <p>物流管理功能正在开发中...</p>
                <p>将包含：</p>
                <ul>
                    <li>车辆信息管理</li>
                    <li>运输路线优化</li>
                    <li>燃料消耗统计</li>
                    <li>运输碳排放计算</li>
                </ul>
            </Card>
        </div>
    );
};

export default LogisticsManagement; 