import { useState, useCallback } from "react";
import { useRequest } from "ahooks";
import { message } from "antd";
import { TranslationResult, LanguageCode } from "../types";
import { translateText } from "../utils/api";

export const useTranslation = () => {
  const [sourceLanguage, setSourceLanguage] = useState<LanguageCode | "auto">("auto");
  const [targetLanguage, setTargetLanguage] = useState<LanguageCode>("zh");
  const [result, setResult] = useState<TranslationResult | null>(null);

  const { loading, runAsync } = useRequest(translateText, {
    manual: true,
    onSuccess: (data) => {
      setResult(data);
      // 将翻译结果保存到本地存储，用于历史记录
      saveToHistory(data);
    },
    onError: (error) => {
      message.error(`翻译失败: ${error.message}`);
    },
  });

  // 交换源语言和目标语言
  const swapLanguages = useCallback(() => {
    if (sourceLanguage !== "auto" && result) {
      const temp = sourceLanguage;
      setSourceLanguage(targetLanguage);
      setTargetLanguage(temp);
    } else {
      message.info("自动检测模式下无法交换语言");
    }
  }, [sourceLanguage, targetLanguage, result]);

  // 翻译方法
  const translate = useCallback(
    async (text: string): Promise<TranslationResult | null> => {
      if (!text.trim()) {
        message.warning("请输入要翻译的文本");
        return null;
      }

      try {
        const result = await runAsync({
          text,
          sourceLanguage,
          targetLanguage,
        });
        return result || null; // 确保返回值为 TranslationResult | null
      } catch (err) {
        // 错误已在useRequest的onError中处理
        return null;
      }
    },
    [runAsync, sourceLanguage, targetLanguage]
  );

  // 保存翻译历史记录到localStorage
  const saveToHistory = (data: TranslationResult) => {
    try {
      const history = JSON.parse(localStorage.getItem("translationHistory") || "[]");
      const newItem = {
        id: Date.now().toString(),
        sourceText: data.sourceText,
        translatedText: data.translatedText,
        sourceLanguage: data.sourceLanguage,
        targetLanguage: data.targetLanguage,
        timestamp: Date.now(),
      };

      // 最多保存20条记录
      const updatedHistory = [newItem, ...history].slice(0, 20);
      localStorage.setItem("translationHistory", JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("保存历史记录失败:", error);
    }
  };

  // 获取历史记录
  const getHistory = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem("translationHistory") || "[]");
    } catch {
      return [];
    }
  }, []);

  return {
    sourceLanguage,
    setSourceLanguage,
    targetLanguage,
    setTargetLanguage,
    translate,
    result,
    loading,
    swapLanguages,
    getHistory,
  };
};
