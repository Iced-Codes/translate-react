import { TranslationRequest, TranslationResult } from "../types";
import { useSelector } from "react-redux";
console.log(import.meta.env);

// OpenRouter API配置
export const API_CONFIG = {
  baseUrl: "https://openrouter.ai/api/v1",
  apiKey: import.meta.env.VITE_OPEN_ROUTER_KEY || "sk-or-v1-...", // 保留原有的key（替换为实际的key）
  model: "deepseek/deepseek-chat-v3-0324:free",
};

// 翻译API请求函数
export async function translateText(request: TranslationRequest): Promise<TranslationResult> {
  // const { modelType } = useSelector((state: any) => state.modelTypeStore);
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_CONFIG.apiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "Translation App",
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        // model: modelType,
        messages: [
          {
            role: "system",
            content: `You are a professional translator. Translate the following text from ${
              request.sourceLanguage === "auto" ? "the detected language" : request.sourceLanguage
            } to ${request.targetLanguage}. Only respond with the translation, no explanations or additional text.`,
          },
          {
            role: "user",
            content: request.text,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.choices[0].message.content;

    return {
      translatedText,
      sourceText: request.text,
      sourceLanguage: request.sourceLanguage === "auto" ? data.choices[0].message.detected_language || "en" : request.sourceLanguage,
      targetLanguage: request.targetLanguage,
    };
  } catch (error) {
    console.error("Translation API error:", error);
    throw error;
  }
}

// 获取支持的语言列表
export async function getSupportedLanguages(): Promise<{ code: string; name: string }[]> {
  // 这里通常会调用API获取支持的语言，但为了简化，我们直接返回一个常用语言列表
  return [
    { code: "auto", name: "自动检测" },
    { code: "zh", name: "中文" },
    { code: "en", name: "英文" },
    { code: "ja", name: "日文" },
    { code: "ko", name: "韩文" },
    { code: "fr", name: "法文" },
    { code: "de", name: "德文" },
    { code: "es", name: "西班牙文" },
    { code: "it", name: "意大利文" },
    { code: "ru", name: "俄文" },
  ];
}
