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

## Docker 环境配置

### 环境说明

项目提供了三套 Docker 配置：

1. **开发环境** (`docker-compose.yml` / `docker-compose.dev.yml`)
   - 支持热重载
   - 包含调试端口
   - 挂载源代码目录
   - 详细日志输出

2. **生产环境** (`docker-compose.prod.yml`)
   - 多阶段构建优化
   - Nginx 反向代理
   - 健康检查
   - 资源限制
   - 安全配置

3. **基础服务** (`docker-compose.yml`)
   - 仅包含数据库和缓存
   - 用于本地开发时单独启动服务

### 开发环境部署

#### 方式一：完整 Docker 开发环境

```bash
# 使用开发环境配置启动所有服务
docker-compose -f docker-compose.dev.yml up --build

# 后台运行
docker-compose -f docker-compose.dev.yml up -d --build

# 查看服务状态
docker-compose -f docker-compose.dev.yml ps

# 查看日志
docker-compose -f docker-compose.dev.yml logs -f

# 停止服务
docker-compose -f docker-compose.dev.yml down
```

#### 方式二：混合开发环境 (推荐)

```bash
# 1. 启动基础服务 (数据库 + 缓存)
docker-compose up -d postgres redis

# 2. 本地启动后端服务
cd backend
npm install
npm run start:dev

# 3. 本地启动前端服务 (新终端)
cd frontend
npm install
npm start

# 4. 本地启动数据服务 (新终端)
cd data-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt -r requirements-dev.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 生产环境部署

#### 1. 环境变量配置

```bash
# 复制生产环境配置模板
cp env.prod.example .env.prod

# 编辑生产环境配置
nano .env.prod
```

生产环境配置示例：
```env
# 数据库配置
DB_USERNAME=postgres
DB_PASSWORD=your-strong-password-here
DB_NAME=carbon_emission_db

# Redis 配置
REDIS_PASSWORD=your-redis-password-here

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key-for-production

# 前端配置
FRONTEND_URL=https://yourdomain.com
REACT_APP_API_URL=https://yourdomain.com/api/v1
```

#### 2. 启动生产环境

```bash
# 使用生产环境配置
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

# 查看服务状态
docker-compose -f docker-compose.prod.yml ps

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f

# 健康检查
curl http://localhost/health
curl http://localhost/api/v1/health
```

## 环境配置详解

### 1. 数据库服务配置

#### 开发环境
```bash
# 启动数据库服务
docker-compose up -d postgres redis

# 连接到数据库
docker exec -it carbon-emission-postgres-0527 psql -U postgres -d carbon_emission_db

# 查看数据库状态
docker-compose logs postgres
```

#### 生产环境
```bash
# 数据库备份
docker exec carbon-emission-postgres-prod-0527 pg_dump -U postgres carbon_emission_db > backup.sql

# 数据库恢复
docker exec -i carbon-emission-postgres-prod-0527 psql -U postgres carbon_emission_db < backup.sql
```

### 2. 后端服务配置

#### 开发环境配置
```bash
cd backend

# 复制环境变量模板
cp env.example .env

# 编辑环境变量
nano .env
```

`.env` 文件内容：
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
JWT_SECRET=dev-carbon-emission-secret-key
JWT_EXPIRES_IN=7d

# 前端URL
FRONTEND_URL=http://localhost:3000
```

#### 调试配置
```bash
# 启动调试模式
npm run start:debug

# 使用 VS Code 调试
# 在 .vscode/launch.json 中配置调试器
```

### 3. 前端服务配置

#### 开发环境
```bash
cd frontend

# 创建环境变量文件
echo "REACT_APP_API_URL=http://localhost:3001/api/v1" > .env.local
echo "REACT_APP_ENV=development" >> .env.local
```

#### 生产构建
```bash
# 构建生产版本
npm run build

# 预览构建结果
npx serve -s build
```

### 4. 数据服务配置

#### 开发环境
```bash
cd data-service

# 创建虚拟环境
python -m venv venv
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt -r requirements-dev.txt

# 创建环境变量文件
cat > .env << EOF
ENVIRONMENT=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/carbon_emission_db
REDIS_URL=redis://localhost:6379
DEBUG=true
HOST=0.0.0.0
PORT=8000
EOF
```

#### 代码质量检查
```bash
# 代码格式化
black .
isort .

# 代码检查
flake8 .
mypy .

# 运行测试
pytest
```

## 服务访问地址

### 开发环境
- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:3001
- **后端API文档**: http://localhost:3001/api/docs
- **数据服务**: http://localhost:8000
- **数据服务文档**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### 生产环境
- **应用入口**: http://localhost (或您的域名)
- **API接口**: http://localhost/api/v1
- **数据服务**: http://localhost/data-api
- **健康检查**: http://localhost/health

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

# 测试前端代理 (开发环境)
curl http://localhost:3000/api/v1/dashboard/overview

# 测试生产环境
curl http://localhost/api/v1/dashboard/overview
curl http://localhost/data-api/health
```

### 3. 数据库连接测试
```bash
# 连接 PostgreSQL
docker exec -it carbon-emission-postgres-0527 psql -U postgres -d carbon_emission_db

# 在 psql 中执行
\dt  # 查看表
SELECT version();  # 查看版本
\q   # 退出

# 连接 Redis
docker exec -it carbon-emission-redis-0527 redis-cli
ping  # 应返回 PONG
exit
```

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
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-docker"
  ]
}
```

### 2. 调试配置

#### VS Code 调试配置 (.vscode/launch.json)
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "address": "localhost",
      "localRoot": "${workspaceFolder}/backend",
      "remoteRoot": "/app",
      "protocol": "inspector"
    },
    {
      "name": "Debug Frontend",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/frontend",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["start"]
    },
    {
      "name": "Debug Data Service",
      "type": "python",
      "request": "launch",
      "program": "${workspaceFolder}/data-service/main.py",
      "cwd": "${workspaceFolder}/data-service",
      "env": {
        "PYTHONPATH": "${workspaceFolder}/data-service"
      }
    }
  ]
}
```

### 3. 代码格式化配置

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
```toml
# pyproject.toml
[tool.black]
line-length = 88
target-version = ['py39']
include = '\.pyi?$'
```

## 常见问题解决

### 1. 端口冲突
```bash
# 查找占用端口的进程
lsof -i :3001

# 杀死进程
kill -9 <PID>

# 或者修改端口配置
# 在 docker-compose.yml 中修改端口映射
```

### 2. 数据库连接失败
```bash
# 检查 Docker 服务状态
docker-compose ps

# 重启数据库服务
docker-compose restart postgres

# 查看数据库日志
docker-compose logs postgres

# 检查网络连接
docker network ls
docker network inspect linkprojects_carbon-emission-network-0527
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

# Docker 构建缓存问题
docker-compose build --no-cache
```

### 4. 前端编译错误
```bash
# 清理构建缓存
rm -rf build/ .eslintcache

# 检查 TypeScript 配置
npx tsc --noEmit

# 重新启动开发服务器
npm start
```

### 5. Docker 相关问题
```bash
# 清理 Docker 资源
docker system prune -a

# 重新构建镜像
docker-compose build --no-cache

# 查看容器日志
docker-compose logs -f [service-name]

# 进入容器调试
docker exec -it [container-name] /bin/sh
```

## 性能优化

### 开发环境优化
```bash
# 启用 Docker BuildKit
export DOCKER_BUILDKIT=1

# 使用 Docker Compose 并行构建
docker-compose build --parallel

# 前端热重载优化
echo "CHOKIDAR_USEPOLLING=true" >> frontend/.env.local
```

### 生产环境优化
```bash
# 启用 Nginx 缓存
# 在 nginx.conf 中配置缓存策略

# 数据库连接池优化
# 在后端配置中调整连接池大小

# Redis 内存优化
# 配置 Redis 内存策略
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
tail -f data-service/logs/app.log
```

### 性能监控
```bash
# 查看容器资源使用
docker stats

# 查看系统资源
htop
df -h
free -h

# 数据库性能
docker exec -it carbon-emission-postgres-0527 psql -U postgres -c "SELECT * FROM pg_stat_activity;"
```

## 部署脚本

### 开发环境快速启动脚本
```bash
#!/bin/bash
# scripts/dev-start.sh

echo "启动开发环境..."

# 启动基础服务
docker-compose up -d postgres redis

# 等待服务启动
sleep 10

# 启动后端
cd backend && npm run start:dev &

# 启动前端
cd ../frontend && npm start &

# 启动数据服务
cd ../data-service && source venv/bin/activate && uvicorn main:app --reload &

echo "所有服务已启动"
echo "前端: http://localhost:3000"
echo "后端: http://localhost:3001"
echo "数据服务: http://localhost:8000"
```

### 生产环境部署脚本
```bash
#!/bin/bash
# scripts/prod-deploy.sh

echo "部署生产环境..."

# 拉取最新代码
git pull origin main

# 构建并启动服务
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

# 等待服务启动
sleep 30

# 健康检查
curl -f http://localhost/health || exit 1

echo "生产环境部署完成"
echo "应用地址: http://localhost"
```

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