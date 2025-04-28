// 语言类型定义
export type LanguageCode = string;

// 翻译请求类型定义
export interface TranslationRequest {
  text: string;
  model: string;
  sourceLanguage: LanguageCode | "auto";
  targetLanguage: LanguageCode;
}

// 翻译结果类型定义
export interface TranslationResult {
  translatedText: string;
  detectedLanguage?: LanguageCode;
  sourceText: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  recommendations?: {
    synonyms?: string[];
    related_phrases?: string[];
    usage_examples?: string[];
  };
}

// 文件上传类型定义
export interface FileUploadResult {
  content: string;
  fileName: string;
  fileType: string;
  size: number;
}

// 推荐词条类型定义
export interface RecommendationItem {
  text: string;
  type: "word" | "phrase" | "sentence";
  frequency?: number;
}

// 历史记录类型定义
export interface HistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  timestamp: number;
}

// API配置类型定义
export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
  apiVersion?: string;
}
