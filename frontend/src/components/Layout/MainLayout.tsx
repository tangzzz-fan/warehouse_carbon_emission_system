import React, { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import {
    DashboardOutlined,
    CloudOutlined,
    HomeOutlined,
    CarOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider } = Layout;

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const menuItems = [
        {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: '仪表板',
        },
        {
            key: '/carbon',
            icon: <CloudOutlined />,
            label: '碳排放管理',
        },
        {
            key: '/warehouse',
            icon: <HomeOutlined />,
            label: '冷库管理',
        },
        {
            key: '/logistics',
            icon: <CarOutlined />,
            label: '物流管理',
        },
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        navigate(key);
    };

    const getSelectedKey = () => {
        const path = location.pathname;
        if (path.startsWith('/carbon')) return '/carbon';
        if (path.startsWith('/warehouse')) return '/warehouse';
        if (path.startsWith('/logistics')) return '/logistics';
        return '/dashboard';
    };

    return (
        <Layout style={{ height: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div style={{
                    height: 32,
                    margin: 16,
                    background: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                }}>
                    {collapsed ? '碳监测' : '碳排放监测系统'}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[getSelectedKey()]}
                    items={menuItems}
                    onClick={handleMenuClick}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: () => setCollapsed(!collapsed),
                            style: { fontSize: '18px', padding: '0 24px', cursor: 'pointer' }
                        })}
                        <h2 style={{ margin: 0, color: '#001529' }}>冷库物流园区碳排放检测管理系统</h2>
                    </div>
                </Header>
                {children}
            </Layout>
        </Layout>
    );
};

export default MainLayout; 