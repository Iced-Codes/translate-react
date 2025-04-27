/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENROUTER_API_KEY: string;
  // 可以添加更多环境变量的类型定义
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
