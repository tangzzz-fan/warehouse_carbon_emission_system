import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/dashboard';
import CarbonManagement from './pages/carbon';
import WarehouseManagement from './pages/warehouse';
import LogisticsManagement from './pages/logistics';
import './App.css';

const { Content } = Layout;

const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/*" element={
                        <MainLayout>
                            <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
                                <Routes>
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/carbon/*" element={<CarbonManagement />} />
                                    <Route path="/warehouse/*" element={<WarehouseManagement />} />
                                    <Route path="/logistics/*" element={<LogisticsManagement />} />
                                </Routes>
                            </Content>
                        </MainLayout>
                    } />
                </Routes>
            </div>
        </Router>
    );
};

export default App; 