import { useState, useEffect, useCallback } from "react";
import { useRequest } from "ahooks";
import { RecommendationItem, TranslationResult } from "../types";

// 模拟获取推荐词的API函数
const fetchRecommendations = async (text: string, language: string): Promise<RecommendationItem[]> => {
  // 实际项目中，这里会调用后端API获取相关推荐
  // 这里我们使用模拟数据

  // 延迟模拟网络请求
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 简单的词频分析（实际应用中会更复杂）
  const words = text.split(/\s+/).filter((word) => word.length > 3);
  const wordFrequency: Record<string, number> = {};

  words.forEach((word) => {
    const normalized = word.toLowerCase().replace(/[^\w\s]/g, "");
    if (normalized) {
      wordFrequency[normalized] = (wordFrequency[normalized] || 0) + 1;
    }
  });

  // 转换为推荐项目格式
  const recommendations = Object.entries(wordFrequency)
    .filter(([_, freq]) => freq > 0) // 过滤出现频率高的词
    .map(([word, frequency]) => ({
      text: word,
      type: word.length > 6 ? "phrase" : "word",
      frequency,
    }))
    .sort((a, b) => b.frequency! - a.frequency!)
    .slice(0, 10); // 最多返回10个推荐

  return recommendations as RecommendationItem[];
};

export const useRecommendations = (translationResult: TranslationResult | null) => {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);

  // 使用ahooks的useRequest处理API请求
  const { loading, run } = useRequest(fetchRecommendations, {
    manual: true,
    onSuccess: (data) => {
      setRecommendations(data);
    },
  });

  // 当翻译结果变化时，获取新的推荐
  useEffect(() => {
    if (translationResult && translationResult.translatedText) {
      run(translationResult.translatedText, translationResult.targetLanguage);
    }
  }, [translationResult, run]);

  // 获取历史上使用频率最高的词汇
  const getFrequentTerms = useCallback((): RecommendationItem[] => {
    try {
      const history = JSON.parse(localStorage.getItem("translationHistory") || "[]");
      const termCounts: Record<string, number> = {};

      // 统计历史记录中词汇的使用频率
      history.forEach((item: any) => {
        const words = item.translatedText.split(/\s+/);
        words.forEach((word: string) => {
          const normalized = word.toLowerCase().replace(/[^\w\s]/g, "");
          if (normalized && normalized.length > 3) {
            termCounts[normalized] = (termCounts[normalized] || 0) + 1;
          }
        });
      });

      // 转换为推荐项目格式
      return Object.entries(termCounts)
        .map(([text, frequency]) => ({
          text,
          type: (text.length > 6 ? "phrase" : "word") as "phrase" | "word",
          frequency,
        }))
        .sort((a, b) => b.frequency! - a.frequency!)
        .slice(0, 5); // 最多返回5个历史高频词
    } catch (error) {
      console.error("获取历史频率词汇失败:", error);
      return [];
    }
  }, []);

  return {
    recommendations,
    loading,
    getFrequentTerms,
  };
};
