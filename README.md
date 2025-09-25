# lawGo - AI 法律咨询系统

基于 Vue.js + Nest.js 开发的智能化法律服务平台

## 项目简介

本项目开发了一款基于 Web 的 AI 法律咨询系统，旨在利用人工智能技术解决传统法律服务面临的高成本、低效率和地域限制等问题。系统采用 Vue.js 前端框架和 TypeScript 后端语言开发，集成 DeepSeek AI 的自然语言处理能力，结合专业法律知识库，提供智能法律问答、合同分析、语音对话、文书撰写和法规检索等核心功能。

## 项目预览
<img width="174" height="378" alt="image" src="https://github.com/user-attachments/assets/b2c8f1e5-902f-4cad-8b65-9d088a8c8c47" />
<img width="153" height="334" alt="image" src="https://github.com/user-attachments/assets/ca29056a-a865-4a7c-a058-36018863f50d" />
<img width="136" height="288" alt="image" src="https://github.com/user-attachments/assets/b4279a6f-177c-4a89-ac2f-33069bcd5fbc" />
<img width="148" height="291" alt="image" src="https://github.com/user-attachments/assets/8127b7c8-6262-4b3a-a90b-faa3fd8b3a88" />
<img width="136" height="305" alt="image" src="https://github.com/user-attachments/assets/3c989ff9-adcb-4c92-b210-f9772dc56163" />
<img width="124" height="275" alt="image" src="https://github.com/user-attachments/assets/cf7cd99e-8498-4a25-a7bc-d7941869731b" />
<img width="133" height="294" alt="image" src="https://github.com/user-attachments/assets/9ec8ba2c-8412-4b75-9cda-ffeaf786f34d" />
<img width="134" height="293" alt="image" src="https://github.com/user-attachments/assets/e405c509-9f2a-4f15-b44b-957bd59e7a6b" />
<img width="171" height="377" alt="image" src="https://github.com/user-attachments/assets/6739d1f0-be46-43a7-9c24-c99174dcc083" />

## 功能模块

系统包含五大核心模块：

### 1. AI 法律对话模块
- 🤖 智能法律问答
- 🎤 语音交互对话
- 💬 多轮对话记录

### 2. 合同审查模块
- 📄 智能合同分析
- 🔍 华为云 OCR 技术集成
- ⚠️ 风险点识别和建议

### 3. 合同模板下载
- 📋 多种合同模板
- 📥 在线下载服务
- 🔧 模板自定义

### 4. 法规案例搜索
- 🔎 案例智能检索
- 📚 法规条文查询
- 🏛️ 权威法律数据库

### 5. 智能文书撰写
- ✍️ AI 辅助文书生成
- 📝 多种文书类型支持
- 🎯 个性化定制

## 技术架构

### 前端技术栈
- **lawgo-app**: 用户端应用 (Vue 3 + Vite + TypeScript)
- **lawgo-admin**: 管理端应用 (Vue 3 + Vite + TypeScript)
- **UI 框架**: Tailwind CSS + shadcn-vue UI

### 后端技术栈
- **lawgo-server**: 服务端 (Nest.js + TypeScript)
- **数据库**: PostgreSQL
- **身份认证**: JWT
- **AI 服务**: DeepSeek API
- **云服务**: 华为云 SDK (OCR、TTS)

## 项目结构

```
lawGo/
├── lawgo-app/          # 用户端前端应用
│   ├── src/
│   │   ├── views/      # 页面组件
│   │   ├── components/ # 通用组件
│   │   ├── lib/        # 工具库和API
│   │   └── assets/     # 静态资源
├── lawgo-admin/        # 管理端前端应用
│   ├── src/
│   │   ├── views/      # 管理页面
│   │   ├── components/ # 管理组件
│   │   └── lib/        # 管理工具库
├── lawgo-server/       # 后端服务
│   ├── src/
│   │   ├── admin/      # 管理模块
│   │   ├── aichat/     # AI对话模块
│   │   ├── auth/       # 认证模块
│   │   ├── user/       # 用户模块
│   │   ├── huawei/     # 华为云服务
│   │   └── common/     # 公共模块
├── LICENSE             # MIT 许可证
└── README.md          # 项目说明
```

## 环境配置

### 后端环境变量

在 `lawgo-server` 目录下创建 `.env` 文件，配置以下环境变量：

```env
# 数据库配置
DATABASE_HOST=localhost
DATABASE_USERNAME=your_db_username
DATABASE_PASSWORD=your_db_password
DATABASE_DBNAME=lawgo_db

# JWT 配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# DeepSeek AI API
DEEPSEEK_API_KEY=your_deepseek_api_key

# 华为云 SDK 配置
HUAWEICLOUD_SDK_AK=your_access_key
HUAWEICLOUD_SDK_SK=your_secret_key
HUAWEICLOUD_PROJECT_ID=your_project_id
```

## 快速开始

### 前置要求
- Node.js (推荐 18+)
- pnpm 包管理器
- PostgreSQL 数据库
- 华为云账号 (用于 OCR 服务)
- DeepSeek API 密钥

### 1. 克隆项目

```bash
git clone https://github.com/tonecn/lawGo.git
cd lawGo
```

### 2. 安装依赖

```bash
# 安装用户端依赖
cd lawgo-app
pnpm install

# 安装管理端依赖
cd ../lawgo-admin
pnpm install

# 安装服务端依赖
cd ../lawgo-server
pnpm install
```

### 3. 配置数据库

1. 创建数据库
2. 在 `lawgo-server/.env` 中配置数据库连接信息
3. 运行数据库迁移 (如有)

### 4. 启动服务

```bash
# 启动后端服务
cd lawgo-server
pnpm start:dev

# 启动用户端应用 (新终端)
cd lawgo-app
pnpm dev

# 启动管理端应用 (新终端)
cd lawgo-admin
pnpm dev
```

### 5. 访问应用

- 用户端应用: http://localhost:5173
- 管理端应用: http://localhost:5174
- 后端服务: http://localhost:3000

## 核心功能实现

### 用户登录认证
- JWT Token 认证机制
- 用户注册和登录
- 权限管理和角色控制

### AI 智能对话
- 集成 DeepSeek AI 大语言模型
- 支持文本和语音输入
- 多轮对话上下文保持

### 智能合同分析
- 华为云 OCR 文字识别
- 合同条款智能解析
- 风险点标注和建议

### 合同模板服务
- 多种行业合同模板
- 在线预览和下载
- 模板个性化定制

### 法规案例检索
- 全文搜索引擎
- 智能匹配推荐
- 结果排序和筛选

### 智能文书撰写
- AI 辅助内容生成
- 模板化文书结构
- 实时预览和编辑

## 未来规划

- 🚀 **模型升级**: 引入更先进的大语言模型提升服务质量
- 📱 **移动端拓展**: 开发移动端应用，提供随时随地的法律服务
- 🤝 **线下衔接**: 探索与线下法律服务的衔接，打造完整服务链条
- 🌐 **生态建设**: 致力于打造更普惠、智能的法律服务生态

## 开发工具

每个子项目都配置了：
- TypeScript 类型支持
- ESLint 代码规范检查
- Prettier 代码格式化
- Vite 快速构建工具 (前端)
- Nest CLI 脚手架工具 (后端)

## 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 联系我

- 项目地址: https://github.com/tonecn/lawGo
- 问题反馈: [GitHub Issues](https://github.com/tonecn/lawGo/issues)
