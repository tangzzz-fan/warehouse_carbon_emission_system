# 冷库物流园区碳排放检测管理系统 - 运行指南

## 快速开始

本指南将帮助您在本地环境中快速搭建和运行整个系统。

## 系统要求

### 基础环境
- **操作系统**: macOS 10.15+, Ubuntu 18.04+, Windows 10+
- **内存**: 最低 8GB，推荐 16GB
- **磁盘空间**: 最低 10GB 可用空间
- **网络**: 稳定的互联网连接

### 必需软件

#### 1. Node.js 环境
```bash
# 安装 Node.js 18+ (推荐使用 nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# 验证安装
node --version  # 应显示 v18.x.x
npm --version   # 应显示 9.x.x
```

#### 2. Python 环境
```bash
# 安装 Python 3.9+ (推荐使用 pyenv)
curl https://pyenv.run | bash
pyenv install 3.9.16
pyenv global 3.9.16

# 验证安装
python --version  # 应显示 Python 3.9.x
pip --version      # 应显示 pip 22.x.x
```

#### 3. Docker 环境
```bash
# macOS (使用 Homebrew)
brew install docker docker-compose

# Ubuntu
sudo apt-get update
sudo apt-get install docker.io docker-compose

# 验证安装
docker --version         # 应显示 Docker version 20.x.x
docker-compose --version # 应显示 docker-compose version 1.29.x
```

#### 4. Git
```bash
# macOS
brew install git

# Ubuntu
sudo apt-get install git

# 验证安装
git --version  # 应显示 git version 2.x.x
```

## 项目获取

### 克隆项目
```bash
# 克隆项目到本地
git clone <repository-url>
cd LinkProjects

# 查看项目结构
ls -la
# 应该看到: backend/ frontend/ data-service/ docker-compose.yml
```

## 环境配置

### 1. 数据库服务启动

使用 Docker Compose 启动 PostgreSQL 和 Redis：

```bash
# 启动数据库服务
docker-compose up -d postgres redis

# 验证服务状态
docker-compose ps
# 应该看到 postgres 和 redis 服务状态为 Up
```

### 2. 环境变量配置

#### 后端环境配置
```bash
# 进入后端目录
cd backend

# 复制环境变量模板
cp .env.example .env

# 编辑环境变量 (使用你喜欢的编辑器)
nano .env
```

`.env` 文件内容示例：
```env
# 应用配置
NODE_ENV=development
PORT=3001

# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=carbon_emission_db

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT配置
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# 前端URL
FRONTEND_URL=http://localhost:3000
```

#### 前端环境配置
```bash
# 进入前端目录
cd ../frontend

# 创建环境变量文件
echo "REACT_APP_API_URL=http://localhost:3001" > .env
```

#### 数据服务环境配置
```bash
# 进入数据服务目录
cd ../data-service

# 复制环境变量模板
cp .env.example .env

# 编辑环境变量
nano .env
```

`.env` 文件内容示例：
```env
# 应用配置
ENVIRONMENT=development
PORT=8000

# 数据库配置
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/carbon_emission_db

# Redis配置
REDIS_URL=redis://localhost:6379

# API配置
API_V1_STR=/api/v1
PROJECT_NAME=Carbon Emission Data Service
```

## 安装依赖

### 1. 后端依赖安装
```bash
cd backend

# 安装 npm 依赖
npm install

# 验证安装
npm list --depth=0
```

### 2. 前端依赖安装
```bash
cd ../frontend

# 安装 npm 依赖
npm install

# 验证安装
npm list --depth=0
```

### 3. 数据服务依赖安装
```bash
cd ../data-service

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# macOS/Linux:
source venv/bin/activate
# Windows:
# venv\Scripts\activate

# 安装 Python 依赖
pip install -r requirements.txt

# 验证安装
pip list
```

## 数据库初始化

### 1. 创建数据库
```bash
# 连接到 PostgreSQL
docker exec -it linkprojects_postgres_1 psql -U postgres

# 在 psql 中执行
CREATE DATABASE carbon_emission_db;
\q
```

### 2. 运行数据库迁移
```bash
cd backend

# 运行数据库迁移 (如果有)
npm run migration:run

# 或者同步数据库结构
npm run typeorm:sync
```

## 启动服务

### 方式一：分别启动各服务

#### 1. 启动后端服务
```bash
cd backend

# 开发模式启动
npm run start:dev

# 服务启动成功后会显示:
# 🚀 应用已启动，运行在端口 3001
# 📚 API文档地址: http://localhost:3001/api/docs
```

#### 2. 启动前端服务
```bash
# 新开终端窗口
cd frontend

# 启动开发服务器
npm start

# 服务启动成功后会自动打开浏览器: http://localhost:3000
```

#### 3. 启动数据服务
```bash
# 新开终端窗口
cd data-service

# 激活虚拟环境
source venv/bin/activate

# 启动 FastAPI 服务
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 服务启动成功后可访问: http://localhost:8000/docs
```

### 方式二：使用 Docker Compose 启动所有服务

```bash
# 在项目根目录
docker-compose up --build

# 后台运行
docker-compose up -d --build

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

## 验证安装

### 1. 检查服务状态
```bash
# 检查端口占用
lsof -i :3000  # 前端服务
lsof -i :3001  # 后端服务
lsof -i :8000  # 数据服务
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis
```

### 2. 测试 API 接口
```bash
# 测试后端 API
curl http://localhost:3001/api/v1/dashboard/overview

# 测试数据服务 API
curl http://localhost:8000/health

# 测试前端代理
curl http://localhost:3000/api/v1/dashboard/overview
```

### 3. 访问 Web 界面
- **前端应用**: http://localhost:3000
- **后端API文档**: http://localhost:3001/api/docs
- **数据服务文档**: http://localhost:8000/docs

## 开发工具配置

### 1. VS Code 配置

推荐安装的扩展：
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-python.python",
    "ms-python.flake8",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint"
  ]
}
```

### 2. 代码格式化配置

#### 前端和后端 (Prettier)
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

#### Python (Black)
```bash
cd data-service
pip install black
black . --line-length 88
```

## 常见问题解决

### 1. 端口冲突
```bash
# 查找占用端口的进程
lsof -i :3001

# 杀死进程
kill -9 <PID>
```

### 2. 数据库连接失败
```bash
# 检查 Docker 服务状态
docker-compose ps

# 重启数据库服务
docker-compose restart postgres

# 查看数据库日志
docker-compose logs postgres
```

### 3. 依赖安装失败
```bash
# 清理 npm 缓存
npm cache clean --force

# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install

# Python 依赖问题
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

### 4. 前端编译错误
```bash
# 清理构建缓存
rm -rf build/ .eslintcache

# 重新启动开发服务器
npm start
```

## 开发模式

### 热重载开发
- **前端**: 修改代码后自动刷新浏览器
- **后端**: 使用 `npm run start:dev` 自动重启服务
- **数据服务**: 使用 `--reload` 参数自动重启

### 调试配置

#### VS Code 调试配置 (.vscode/launch.json)
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/src/main.ts",
      "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"],
      "runtimeArgs": ["-r", "ts-node/register"]
    },
    {
      "name": "Debug Frontend",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/frontend",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["start"]
    }
  ]
}
```

## 生产部署

### 1. 构建生产版本
```bash
# 构建前端
cd frontend
npm run build

# 构建后端
cd ../backend
npm run build

# 构建数据服务 Docker 镜像
cd ../data-service
docker build -t carbon-data-service .
```

### 2. 生产环境配置
```bash
# 使用生产环境配置
docker-compose -f docker-compose.prod.yml up -d
```

## 监控和日志

### 查看应用日志
```bash
# Docker 容器日志
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f data-service

# 本地开发日志
tail -f backend/logs/application.log
```

### 性能监控
- **前端**: 使用浏览器开发者工具
- **后端**: 查看 API 响应时间
- **数据库**: 使用 pgAdmin 或命令行工具

## 下一步

1. **阅读架构文档**: [ARCHITECTURE.md](./ARCHITECTURE.md)
2. **查看API文档**: http://localhost:3001/api/docs
3. **了解开发规范**: [.cursorrules](./.cursorrules)
4. **参与开发**: 查看项目 Issues 和 TODO 列表

## 获取帮助

- **技术问题**: 查看项目 Issues
- **文档问题**: 提交 Pull Request
- **功能建议**: 创建 Feature Request

---

*如果您在安装或运行过程中遇到问题，请查看常见问题部分或创建 Issue。* 