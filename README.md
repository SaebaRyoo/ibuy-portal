# Ibuy B2C 购物商城

该项目是一个B2C购物商城，使用 Next.js 构建，支持商品浏览、购物车管理、支付处理和订单跟踪等功能。项目基于 [huanghanzhilian/c-shopping](https://github.com/huanghanzhilian/c-shopping) 开源项目进行二次开发。

## 📑 目录

- [项目概述](#项目概述)
- [主要功能](#主要功能)
- [技术栈](#技术栈)
- [安装与使用](#安装与使用)
- [项目结构](#项目结构)
- [部署指南](#部署指南)
- [贡献指南](#贡献指南)
- [版权声明](#版权声明)

## 🔍 项目概述

该项目是一个采用前后端分离架构的B2C购物商城：
- **前端Portal仓库: [ibuy-portal](https://github.com/SaebaRyoo/ibuy-portal)**：使用 Next.js 开发，生成静态文件独立部署，同时也支持Vercel部署方案，具有优秀的性能和SEO友好的特性
- **Portal后端仓库: [ibuy-portal-backend](https://github.com/SaebaRyoo/ibuy-portal-backend)**：使用 Nest.js 框架开发，提供RESTful API接口，负责处理业务逻辑、数据存储和第三方服务集成
- **后台管理平台: [ibuy-admin](https://github.com/SaebaRyoo/ibuy-admin-backend)**：使用 ant-design pro进行二次开发。管理商品、订单等
- **后台管理平台: [ibuy-admin-backend](https://github.com/SaebaRyoo/ibuy-admin-backend)**：使用 Nest.js 框架开发，提供RESTful API接口,处理后台管理业务逻辑


## 🛠️ 技术栈
- **前端框架**：Next.js 14
- **UI 组件**：React 18
- **状态管理**：Redux Toolkit
- **样式方案**：Tailwind CSS
- **图标库**：React Icons
- **API 调用**：RTK Query
- **身份验证**：JWT + localStorage
- **支付集成**：支付宝支付

## 📦 安装与使用

### 前提条件

- Node.js 16.x 或更高版本
- npm 或 yarn

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/SaebaRyoo/ibuy-portal.git
cd ibuy-portal
```

2. 安装依赖
```bash
npm install
# 或
yarn install
```

3. 创建环境变量文件
基于`.env.example`文件创建`.env`文件，设置必要的环境变量

4. 启动开发服务器
```bash
npm run dev
# 或
yarn dev
```

5. 打开浏览器访问 http://localhost:3000

## 📁 项目结构

```
/
├── app/                    # Next.js 应用目录
│   ├── (main)/             # 主要布局路由
│   └── api/                # API 路由
├── components/             # React 组件
│   ├── sliders/            # 轮播图组件
│   └── ...                 # 其他组件
├── hooks/                  # 自定义React Hooks
├── store/                  # Redux 状态管理
│   ├── slices/             # Redux 切片
│   └── services/           # RTK Query 服务
├── public/                 # 静态资源
└── ...
```

## 🚀 部署指南

### 静态导出

```bash
npm run build
# 或
yarn build
```

生成的静态文件位于 `out` 目录，可以部署到任何静态网站托管服务上。

### 部署建议

- **Vercel**：一键部署，自动优化
- **云服务器**：将out目录复制到 Nginx/Apache 服务器的静态资源目录

## 👥 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📄 版权声明

该前端Portal项目基于 [huanghanzhilian/c-shopping](https://github.com/huanghanzhilian/c-shopping) 进行开发，原项目采用 MIT 许可证。

```
MIT License

Copyright (c) 2024 Jipeng Huang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

本项目在原项目基础上进行了二次开发和定制，同样采用 MIT 许可证发布。

Copyright (c) 2024 [你的名字]

---

如有问题或建议，请提交 issue 或联系项目维护者。
