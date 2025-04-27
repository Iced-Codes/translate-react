import { createContext, useContext } from "react";

// 支持的语言
export enum SupportedLocale {
  ZH = "zh",
  EN = "en",
}

// 默认语言
export const DEFAULT_LOCALE = SupportedLocale.ZH;

// 语言环境上下文
interface LocaleContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string) => string;
}

export const LocaleContext = createContext<LocaleContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key) => key,
});

// 使用国际化的Hook
export const useLocale = () => useContext(LocaleContext);

// 定义翻译资源类型
type LocaleMessages = Record<string, string>;

// 翻译资源
export const localeResources: Record<SupportedLocale, LocaleMessages> = {
  [SupportedLocale.ZH]: {
    // 通用
    "app.title": "翻译助手",
    "app.footer": "翻译助手 © {year} Created with React & Ant Design",

    // 翻译相关
    "translation.title": "文本翻译",
    "translation.sourceLanguage": "源语言",
    "translation.targetLanguage": "目标语言",
    "translation.placeholder": "请输入要翻译的文本",
    "translation.button": "翻译",
    "translation.result": "翻译结果",
    "translation.emptyText": "请输入要翻译的文本",
    "translation.overLimit": "文本超出限制",
    "translation.copySuccess": "已复制到剪贴板",
    "translation.copyFail": "复制失败",
    "translation.characterCount": "{count}/{max}",

    // 文件上传
    "upload.text": "点击或拖拽文件到此区域",
    "upload.hint": "支持 .txt, .docx 格式文件, 最大 {size}MB",
    "upload.progress": "处理中...",
    "upload.success": '文件"{name}"已成功解析',
    "upload.error": "文件处理失败",
    "upload.sizeLimit": "文件大小不能超过{size}MB",
    "upload.typeLimit": "只支持{types}格式文件",
    "upload.truncated": "文件内容已截断至{max}字符",

    // 推荐面板
    "recommendation.title": "相关推荐",
    "recommendation.current": "当前翻译",
    "recommendation.history": "历史推荐",
    "recommendation.empty": "暂无推荐",

    // 错误提示
    "error.translation": "翻译失败: {message}",
    "error.network": "网络错误，请稍后重试",
    "error.speechNotSupported": "您的浏览器不支持语音合成功能",

    // 其他
    "swap.disabled": "自动检测模式下无法交换语言",
  },
  [SupportedLocale.EN]: {
    // 通用
    "app.title": "Translation Assistant",
    "app.footer": "Translation Assistant © {year} Created with React & Ant Design",

    // 翻译相关
    "translation.title": "Text Translation",
    "translation.sourceLanguage": "Source Language",
    "translation.targetLanguage": "Target Language",
    "translation.placeholder": "Enter text to translate",
    "translation.button": "Translate",
    "translation.result": "Translation Result",
    "translation.emptyText": "Please enter text to translate",
    "translation.overLimit": "Text exceeds limit",
    "translation.copySuccess": "Copied to clipboard",
    "translation.copyFail": "Copy failed",
    "translation.characterCount": "{count}/{max}",

    // 文件上传
    "upload.text": "Click or drag file to this area",
    "upload.hint": "Support .txt, .docx format, max {size}MB",
    "upload.progress": "Processing...",
    "upload.success": 'File "{name}" successfully parsed',
    "upload.error": "File processing failed",
    "upload.sizeLimit": "File size cannot exceed {size}MB",
    "upload.typeLimit": "Only {types} format supported",
    "upload.truncated": "File content truncated to {max} characters",

    // 推荐面板
    "recommendation.title": "Recommendations",
    "recommendation.current": "Current Translation",
    "recommendation.history": "History",
    "recommendation.empty": "No recommendations",

    // 错误提示
    "error.translation": "Translation failed: {message}",
    "error.network": "Network error, please try again later",
    "error.speechNotSupported": "Your browser does not support speech synthesis",

    // 其他
    "swap.disabled": "Cannot swap languages in auto-detect mode",
  },
};

// 翻译函数
export const translate = (locale: SupportedLocale, key: string, params?: Record<string, string | number>): string => {
  const resources = localeResources[locale] || localeResources[DEFAULT_LOCALE];
  let value = resources[key] || key;

  // 替换参数
  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      value = value.replace(`{${paramKey}}`, String(paramValue));
    });
  }

  return value;
};
