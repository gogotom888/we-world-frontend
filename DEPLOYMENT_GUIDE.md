# 🚀 We-World Precision Engineering - 完整部署指南

## 📦 系统架构

```
┌─────────────────────────────────────────────────────┐
│                    用户浏览器                         │
└───────────────────┬─────────────────────────────────┘
                    │ HTTP/HTTPS
┌───────────────────▼─────────────────────────────────┐
│                  Nginx (80/443)                      │
│  ┌─────────────────┬──────────────────────────┐    │
│  │  静态文件服务    │    API反向代理            │    │
│  │  /var/www/      │    /api → :1337          │    │
│  └─────────────────┴──────────────────────────┘    │
└───────────────────┬────────────┬────────────────────┘
                    │            │
        ┌───────────▼─┐      ┌───▼────────────┐
        │ React前端   │      │ Strapi后端     │
        │ (Vite构建)  │      │ (Node.js)      │
        └─────────────┘      └───┬────────────┘
                                 │
                         ┌───────▼─────────┐
                         │  PostgreSQL     │
                         │  (数据库)        │
                         └─────────────────┘
```

## 🛠️ 环境要求

### 必需软件
- **Node.js**: v18.0.0 - v22.x.x
- **PostgreSQL**: 14+ 
- **Nginx**: 1.18+
- **Git**: 任意版本

### 推荐服务器配置
- **CPU**: 2核+
- **内存**: 4GB+
- **硬盘**: 20GB+
- **操作系统**: Ubuntu 20.04+ / CentOS 8+ / Windows Server 2019+

---

## 📥 第一步:安装PostgreSQL

### Windows

1. 下载PostgreSQL安装包:
   ```
   https://www.postgresql.org/download/windows/
   ```

2. 安装时设置:
   - 端口: 5432(默认)
   - 密码: 设置postgres用户密码

3. 创建数据库:
   ```cmd
   # 打开PowerShell或CMD
   psql -U postgres
   
   # 在psql中执行
   CREATE DATABASE we_world_db;
   CREATE USER strapi_user WITH ENCRYPTED PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE we_world_db TO strapi_user;
   \q
   ```

### Linux (Ubuntu/Debian)

```bash
# 更新包列表
sudo apt update

# 安装PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# 启动PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 创建数据库
sudo -u postgres psql << EOF
CREATE DATABASE we_world_db;
CREATE USER strapi_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE we_world_db TO strapi_user;
\q
EOF
```

---

## 📦 第二步:配置后端(Strapi)

### 1. 进入后端目录
```bash
cd backend-strapi
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑.env文件
nano .env  # Linux
notepad .env  # Windows
```

修改以下内容:
```env
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=we_world_db
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=your_secure_password

# 生成随机密钥(重要!)
# 使用命令: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
ADMIN_JWT_SECRET=生成的随机字符串1
API_TOKEN_SALT=生成的随机字符串2
TRANSFER_TOKEN_SALT=生成的随机字符串3
JWT_SECRET=生成的随机字符串4
APP_KEYS=key1,key2,key3,key4
```

### 4. 首次启动(开发模式)
```bash
npm run develop
```

### 5. 创建管理员账号
访问 `http://localhost:1337/admin` 创建第一个管理员账号

### 6. 添加初始数据
通过Admin Panel添加:
1. **Product Categories** (产品分类)
   - Nameplate 銘板 (slug: nameplate)
   - Aluminum CNC & anodizing 車床及陽極鋁材 (slug: cnc)

2. **Products** (产品)
3. **News** (新闻)

---

## 🎨 第三步:配置前端

### 1. 进入项目根目录
```bash
cd ..  # 返回项目根目录
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑.env.local
nano .env.local  # Linux
notepad .env.local  # Windows
```

添加以下内容:
```env
VITE_API_URL=http://localhost:1337/api
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. 启动开发服务器
```bash
npm run dev
```

访问 `http://localhost:5173`

---

## 🚢 第四步:生产环境部署

### 1. 构建前端
```bash
# 在项目根目录
npm run build
```

构建产物位于 `dist/` 目录

### 2. 构建后端
```bash
cd backend-strapi

# 设置生产环境
NODE_ENV=production npm run build
```

### 3. 安装PM2 (进程管理器)
```bash
npm install -g pm2
```

### 4. 使用PM2启动Strapi
```bash
# 在backend-strapi目录下
pm2 start npm --name "we-world-backend" -- start

# 设置开机自启
pm2 startup
pm2 save

# 查看日志
pm2 logs we-world-backend

# 重启
pm2 restart we-world-backend
```

### 5. 配置Nginx

#### 安装Nginx (Linux)
```bash
sudo apt install nginx -y
```

#### 复制配置文件
```bash
sudo cp backend-strapi/nginx.conf /etc/nginx/sites-available/we-world

# 创建软链接
sudo ln -s /etc/nginx/sites-available/we-world /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

#### 修改Nginx配置中的路径
编辑 `/etc/nginx/sites-available/we-world`:
```nginx
# 修改前端文件路径
root /var/www/we-world/frontend/dist;  # 改为你的实际路径
```

### 6. 部署文件到服务器
```bash
# 创建部署目录
sudo mkdir -p /var/www/we-world/frontend
sudo mkdir -p /var/www/we-world/backend

# 复制文件
sudo cp -r dist/* /var/www/we-world/frontend/
sudo cp -r backend-strapi/* /var/www/we-world/backend/

# 设置权限
sudo chown -R www-data:www-data /var/www/we-world
```

---

## 🔒 第五步:配置HTTPS (推荐)

### 使用Let's Encrypt免费SSL证书

```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书
sudo certbot --nginx -d www.we-world.com.tw -d we-world.com.tw

# 自动续期
sudo certbot renew --dry-run
```

---

## 📊 监控和维护

### 查看Strapi日志
```bash
pm2 logs we-world-backend
```

### 数据库备份
```bash
# 备份
pg_dump -U strapi_user we_world_db > backup_$(date +%Y%m%d).sql

# 恢复
psql -U strapi_user we_world_db < backup_20260202.sql

# 自动备份脚本
crontab -e
# 添加: 0 2 * * * /path/to/backup_script.sh
```

### 性能监控
```bash
# 服务器资源
htop
df -h
free -m

# Nginx访问日志
tail -f /var/log/nginx/we-world-access.log

# PostgreSQL连接数
psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"
```

---

## 🐛 常见问题排查

### 1. 数据库连接失败
```bash
# 检查PostgreSQL状态
sudo systemctl status postgresql

# 检查端口是否开放
sudo netstat -tuln | grep 5432

# 查看PostgreSQL日志
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### 2. Strapi无法启动
```bash
# 检查Node.js版本
node -v

# 清除缓存
cd backend-strapi
rm -rf .cache build

# 重新构建
npm run build
```

### 3. Nginx配置错误
```bash
# 测试配置
sudo nginx -t

# 查看错误日志
sudo tail -f /var/log/nginx/error.log
```

### 4. 前端API连接失败
- 检查 `.env.local` 中的 `VITE_API_URL`
- 确认Strapi正在运行: `pm2 status`
- 检查CORS设置: `backend-strapi/config/middlewares.js`

---

## 📞 技术支持

### Strapi相关
- [官方文档](https://docs.strapi.io/)
- [GitHub](https://github.com/strapi/strapi)

### PostgreSQL相关
- [官方文档](https://www.postgresql.org/docs/)

### Nginx相关
- [官方文档](https://nginx.org/en/docs/)

---

## ✅ 部署检查清单

- [ ] PostgreSQL已安装并运行
- [ ] Strapi后端已配置并启动
- [ ] 管理员账号已创建
- [ ] 初始数据已添加(分类、产品)
- [ ] 前端已构建
- [ ] Nginx已配置并运行
- [ ] PM2进程守护已启用
- [ ] HTTPS证书已配置(推荐)
- [ ] 防火墙规则已设置
- [ ] 数据库备份计划已建立
- [ ] 监控系统已部署

---

## 🎉 部署完成!

访问您的网站:
- **前端**: http://your-domain.com
- **管理后台**: http://your-domain.com/admin
- **API文档**: http://your-domain.com/api
