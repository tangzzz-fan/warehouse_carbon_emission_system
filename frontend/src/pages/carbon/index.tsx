import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const CarbonManagement: React.FC = () => {
    return (
        <div>
            <Title level={2}>碳排放管理</Title>
            <Card>
                <p>碳排放管理功能正在开发中...</p>
                <p>将包含：</p>
                <ul>
                    <li>碳排放数据监控</li>
                    <li>排放因子管理</li>
                    <li>碳足迹计算</li>
                    <li>减排目标设定</li>
                </ul>
            </Card>
        </div>
    );
};

export default CarbonManagement; 