import { TranslationRequest, TranslationResult } from "../types";
// OpenRouter API配置
export const API_CONFIG = {
  baseUrl: "https://openrouter.ai/api/v1",
  apiKey: import.meta.env.VITE_OPEN_ROUTER_KEY || "", // 保留原有的key（替换为实际的key）
};
console.log("🚀 ~ API_CONFIG:", API_CONFIG.apiKey);

// 翻译API请求函数
export async function translateText(request: TranslationRequest): Promise<TranslationResult> {
  // const { modelType } = useSelector((state: any) => state.modelTypeStore);
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${API_CONFIG.apiKey}`,
        Authorization: `Bearer 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`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "Translation App",
      },
      body: JSON.stringify({
        model: request.model,
        // model: modelType,
        messages: [
          {
            role: "system",
            content: `
              请作为专业语言翻译引擎，严格遵循以下规则：
              一、核心能力
              1. 智能语言检测：
                 - 自动识别输入内容的语种(支持zh/en/ja等ISO 639-1代码)
                 - 能识别混合语言内容如"今日のweather不错"
              2. 精准翻译：
                 - 翻译结果需符合目标语言的母语表达习惯
                 - 保留专业术语(医学/法律等)的准确性
                 - 诗歌俳句等文学体裁保持韵律美感
              二、输入处理规范
              1. 接受输入类型：
                 - 单词（如：serendipity）
                 - 短句（如：今天天气真好）
                 - 段落（300字以内）
                 - 语言代码强制指令（"en→ja: Hello world"）
              2. 特殊符号处理：
                 - 保留原格式符号（！?、・等）
                 - 数字保持原样
              三、输出规范
              [
                {
                  "translation": "翻译结果",
                  "detected_lang": "检测到的源语言代码",
                  "target_lang": "目标语言代码",
                  "recommendations": {
                    "synonyms": ["同义词1", "同义词2"],
                    "related_phrases": ["相关短语1", "相关短语2"],
                    "usage_examples": ["例句1", "例句2"]
                  }
                }
              ]
              四、扩展能力
              1. 语境适配：
                 - 自动识别场景(商务/日常/文学)调整用语
                 - 对"LOL"等网络用语给出双版本翻译
              2. 学习模式：
                 - 当用户连续输入同一领域内容时，自动优化术语库
              五、风格控制
              1. 可选修饰符：
                 - [学术]：使用正式书面语
                 - [口语]：采用自然对话体
                 - [简明]：输出最简版本
              2. 禁用行为：
                 - 添加额外解释说明
                 - 修改原始内容意图
            现在开始翻译下列文本从 ${request.sourceLanguage === "auto" ? "检测到的语言" : request.sourceLanguage} 到 ${
              request.targetLanguage
            }。
              `,
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
    const translatedContent = data.choices[0].message.content;

    // 尝试解析JSON格式的响应
    let parsedResponse;
    let translatedText = "";
    let recommendations = undefined;

    try {
      // 尝试解析可能包含的JSON响应
      const jsonMatch = translatedContent.match(/\[\s*{[\s\S]*}\s*\]/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsedResponse) && parsedResponse.length > 0) {
          const firstResult = parsedResponse[0];

          debugger;
          console.log("🚀 ~ translateText ~ firstResult:", firstResult);
          translatedText = firstResult.translation || "";

          firstResult.recommendations && (recommendations = firstResult.recommendations);
        }
      }
    } catch (e) {
      console.warn("无法解析JSON响应，使用原始响应", e);
    }

    // 如果无法解析JSON，则使用原始响应文本
    if (!translatedText) {
      translatedText = translatedContent;
    }

    return {
      translatedText,
      sourceText: request.text,
      sourceLanguage: request.sourceLanguage === "auto" ? data.choices[0].message.detected_language || "en" : request.sourceLanguage,
      targetLanguage: request.targetLanguage,
      recommendations,
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
//获取支持模型列表
// export async function getSupportedModels() {
//   await fetch("https://openrouter.ai/api/frontend/models");
// }
