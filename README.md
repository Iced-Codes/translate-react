# 翻译助手

一个基于React 18+开发的现代化翻译网页应用。

## 技术栈

- React 18+ (函数组件 + Hooks)
- TypeScript
- Ant Design v5
- styled-components
- ahooks

## 功能特性

- 文本翻译 (支持5000字符以内的实时翻译)
- 文件解析 (.txt/.docx)
- 智能推荐
- 历史记录
- 文本朗读
- 内容复制
- 响应式布局
- 国际化支持 (中/英)

## 项目结构

```
src/
├── assets/               # 静态资源
├── components/           # 通用组件
│   ├── ErrorBoundary.tsx # 错误边界
│   ├── FileUploader.tsx  # 文件上传器
│   ├── LanguageSelector.tsx # 语言选择器
│   └── Layout.tsx        # 布局容器
├── features/             # 功能模块
│   ├── translation/      # 翻译功能
│   │   └── TranslationForm.tsx
│   └── recommendations/  # 推荐功能
│       └── RecommendationPanel.tsx
├── hooks/                # 自定义钩子
│   ├── useTranslation.ts # 翻译核心逻辑
│   └── useRecommendations.ts # 推荐逻辑
├── i18n/                 # 国际化
│   ├── index.ts
│   └── LocaleProvider.tsx
├── types/                # 类型定义
│   └── index.ts
├── utils/                # 工具函数
│   └── api.ts            # API相关
├── App.tsx               # 主应用组件
└── main.tsx              # 入口文件
```

## 环境变量配置

项目使用 OpenRouter API 进行翻译。需要在项目根目录创建 `.env` 文件并配置以下环境变量：

```
VITE_OPENROUTER_API_KEY=your_api_key_here
```

## 开发指南

### 安装依赖

```bash
npm install
# 或
yarn
# 或
pnpm install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

### 构建生产版本

```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

## 项目亮点

1. 模块化架构，按功能拆分组件
2. 使用自定义Hooks实现逻辑复用
3. 完整的TypeScript类型定义
4. 使用styled-components实现样式隔离
5. 使用ahooks的useRequest处理API请求
6. 完整的错误处理和边界处理
7. 响应式设计，支持移动端和桌面端
8. 国际化支持
