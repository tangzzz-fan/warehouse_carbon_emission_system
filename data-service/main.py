"""
冷库物流园区碳排放检测管理系统 - 数据服务
Python FastAPI 数据分析与处理服务 - 简化版本
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import logging

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# 创建FastAPI应用
app = FastAPI(
    title="冷库碳排放数据服务",
    description="冷库物流园区碳排放检测管理系统的数据分析与处理服务",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 开发环境允许所有来源
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """根路径健康检查"""
    return {
        "message": "冷库碳排放数据服务运行正常",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """健康检查接口"""
    return {
        "status": "healthy",
        "service": "carbon-emission-data-service",
        "version": "1.0.0"
    }


@app.get("/api/v1/test")
async def test_endpoint():
    """测试接口"""
    return {
        "message": "数据服务测试接口",
        "status": "success",
        "data": {
            "timestamp": "2024-05-27",
            "environment": os.getenv("ENVIRONMENT", "development")
        }
    }


if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "true").lower() == "true"
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    ) 