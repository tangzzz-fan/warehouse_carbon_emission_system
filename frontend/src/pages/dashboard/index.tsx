import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Spin, message } from 'antd';
import { CloudOutlined, HomeOutlined, CarOutlined, AlertOutlined } from '@ant-design/icons';
import { dashboardAPI } from '../../services/api';

const { Title } = Typography;

interface DashboardData {
    totalEmissions: number;
    warehouseCount: number;
    vehicleCount: number;
    alertCount: number;
}

const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DashboardData>({
        totalEmissions: 0,
        warehouseCount: 0,
        vehicleCount: 0,
        alertCount: 0,
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await dashboardAPI.getOverview();
            // 根据后端API返回的数据结构调整
            setData({
                totalEmissions: response.data.totalEmissions,
                warehouseCount: response.data.warehouseCount,
                vehicleCount: response.data.vehicleCount || 28, // 如果后端没有返回，使用默认值
                alertCount: response.data.alertCount,
            });
        } catch (error) {
            message.error('获取仪表板数据失败');
            console.error('Dashboard data fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            <Title level={2}>系统概览</Title>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="总碳排放量"
                            value={data.totalEmissions}
                            precision={2}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<CloudOutlined />}
                            suffix="tCO2e"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="冷库数量"
                            value={data.warehouseCount}
                            valueStyle={{ color: '#1890ff' }}
                            prefix={<HomeOutlined />}
                            suffix="个"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="运输车辆"
                            value={data.vehicleCount}
                            valueStyle={{ color: '#52c41a' }}
                            prefix={<CarOutlined />}
                            suffix="辆"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="告警数量"
                            value={data.alertCount}
                            valueStyle={{ color: '#faad14' }}
                            prefix={<AlertOutlined />}
                            suffix="条"
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Card title="碳排放趋势" style={{ height: 400 }}>
                        <div style={{
                            height: 300,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#999'
                        }}>
                            图表组件将在后续开发中集成
                            <br />
                            <small>当前总排放量: {data.totalEmissions} tCO2e</small>
                        </div>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="能耗分析" style={{ height: 400 }}>
                        <div style={{
                            height: 300,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#999'
                        }}>
                            图表组件将在后续开发中集成
                            <br />
                            <small>监控冷库: {data.warehouseCount} 个</small>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard; 