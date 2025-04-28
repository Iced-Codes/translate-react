import { useState, useRef, useLayoutEffect } from "react";
import { Card, Button, Space, Row, Col, Typography, message, Select, Tabs, List, Tag } from "antd";
import { SwapOutlined, SoundOutlined, CopyOutlined } from "@ant-design/icons";
import styled from "styled-components";
import TextArea from "antd/es/input/TextArea";
import LanguageSelector from "../../components/LanguageSelector";
import FileUploader from "../../components/FileUploader";
import { LanguageCode, FileUploadResult, TranslationResult } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { marked } from "marked";
import DOMpurify from "dompurify";
// import { getSupportedModels } from "@/utils/api";
// import highlight from "@babel/code-frame";
// 修正导入路径 - 使用相对路径
import { setModelType } from "@/store/modelTypeStore";
// import Clipboard from "clipboard";
const { Text, Paragraph, Title } = Typography;
const { TabPane } = Tabs;

interface TranslationFormProps {
  sourceLanguage: LanguageCode | "auto";
  targetLanguage: LanguageCode;
  onSourceLanguageChange: (value: LanguageCode | "auto") => void;
  onTargetLanguageChange: (value: LanguageCode) => void;
  onTranslate: (text: string) => Promise<TranslationResult | null>;
  onSwapLanguages: () => void;
  loading: boolean;
  result: TranslationResult | null;
}

const StyledCard = styled(Card)`
  margin-bottom: 16px;

  .translation-controls {
    margin: 16px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 576px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
  }

  .action-buttons {
    display: flex;
    gap: 8px;
  }

  .result-card {
    background-color: #f8f9fa;
    border-radius: 4px;
    padding: 16px;
    margin-top: 16px;
  }

  .language-row {
    margin-bottom: 16px;
  }
`;

// 添加一个新的推荐组件
interface RecommendationsSectionProps {
  recommendations: {
    synonyms?: string[];
    related_phrases?: string[];
    usage_examples?: string[];
  };
}

const RecommendationsSection = ({ recommendations }: RecommendationsSectionProps) => {
  // 检查recommendations是否存在以及是否有数据
  const hasSynonyms = recommendations?.synonyms && recommendations.synonyms.length > 0;
  const hasRelatedPhrases = recommendations?.related_phrases && recommendations.related_phrases.length > 0;
  const hasUsageExamples = recommendations?.usage_examples && recommendations.usage_examples.length > 0;

  if (!recommendations || (!hasSynonyms && !hasRelatedPhrases && !hasUsageExamples)) {
    return null;
  }

  return (
    <div style={{ marginTop: 16 }}>
      <Title level={5}>相关推荐</Title>
      <Tabs defaultActiveKey={hasSynonyms ? "synonyms" : hasRelatedPhrases ? "phrases" : "examples"}>
        {hasSynonyms && (
          <TabPane tab="同义词" key="synonyms">
            <div style={{ padding: "8px 0" }}>
              {recommendations.synonyms!.map((synonym: string, idx: number) => (
                <Tag key={idx} color="blue" style={{ margin: "4px 8px 4px 0", padding: "4px 8px", fontSize: "14px" }}>
                  {synonym}
                </Tag>
              ))}
            </div>
          </TabPane>
        )}

        {hasRelatedPhrases && (
          <TabPane tab="相关短语" key="phrases">
            <List
              size="small"
              dataSource={recommendations.related_phrases!}
              renderItem={(item: string, index: number) => (
                <List.Item key={index}>
                  <Text>{item}</Text>
                </List.Item>
              )}
            />
          </TabPane>
        )}

        {hasUsageExamples && (
          <TabPane tab="例句" key="examples">
            <List
              size="small"
              dataSource={recommendations.usage_examples!}
              renderItem={(item: string, index: number) => (
                <List.Item key={index}>
                  <Text>{item}</Text>
                </List.Item>
              )}
            />
          </TabPane>
        )}
      </Tabs>
    </div>
  );
};

export default function TranslationForm({
  sourceLanguage,
  targetLanguage,
  onSourceLanguageChange,
  onTargetLanguageChange,
  onTranslate,
  onSwapLanguages,
  loading,
  result,
}: TranslationFormProps) {
  const state = useSelector((state: any) => state.modelTypeStore);
  const dispatch = useDispatch();
  const [sourceText, setSourceText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  // const { data, error, loading: l } = useRequest(getSupportedModels);

  // 字符计数
  const charCount = sourceText.length;
  const maxChars = 5000;
  const isOverLimit = charCount > maxChars;

  // 处理文本变化
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSourceText(e.target.value);
  };

  // 处理翻译按钮点击
  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      message.warning("请输入要翻译的文本");
      return;
    }

    if (isOverLimit) {
      message.error(`文本超过${maxChars}字符限制`);
      return;
    }

    await onTranslate(sourceText);
  };

  // 处理文件上传内容
  const handleFileContent = (fileResult: FileUploadResult) => {
    // 如果文件内容超过5000字符，进行截断
    const content = fileResult.content.length > maxChars ? fileResult.content.substring(0, maxChars) : fileResult.content;

    setSourceText(content);

    if (fileResult.content.length > maxChars) {
      message.warning(`文件内容已截断至${maxChars}字符`);
    }
  };

  // 朗读翻译结果
  const speakText = () => {
    if (!result) return;

    // 如果浏览器不支持语音合成
    if (!window.speechSynthesis) {
      message.error("您的浏览器不支持语音合成功能");
      return;
    }

    // 如果正在朗读，则停止
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // 创建语音合成实例
    const utterance = new SpeechSynthesisUtterance(result.translatedText);
    utterance.lang = result.targetLanguage;

    // 设置语音结束事件
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    // 保存引用以便后续可以中止
    speechSynthesisRef.current = utterance;

    // 开始朗读
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // const translatedText = useRef<any>(null);
  // 复制翻译结果
  const copyResult = () => {
    if (!result) return;
    // const clipboard = new Clipboard(translatedText.current, {
    //   target(elem) {
    //     console.log("🚀 ~ target ~ elem:", elem);
    //     return elem.nextElementSibling;
    //   },
    // });
    // console.log("🚀 ~ copyResult ~ clipboard:", clipboard);
    // clipboard.on("success", (e) => {
    //   message.success(`已复制到剪贴板${e.text}`);
    // });
    // clipboard.on("error", () => {
    //   message.error("复制失败");
    // });
    navigator.clipboard.writeText(result.translatedText).then(
      () => {
        message.success("已复制到剪贴板");
      },
      () => {
        message.error("复制失败");
      }
    );
  };
  const [translatedText, setTranslatedText] = useState("");
  useLayoutEffect(() => {
    if (result) {
      console.log("🚀 ~ useLayoutEffect ~ result:", result);

      setTranslatedText(() => marked.parse(DOMpurify.sanitize(result.translatedText) as string) as string);
      // const text = highlight(marked.parse(DOMpurify.sanitize(result.translatedText) as string));

      // console.log("🚀 ~ useLayoutEffect ~ translatedText:", translatedText.current, text, document.querySelector("#translatedText"));
    }
  }, [result?.translatedText]);

  return (
    <StyledCard title="文本翻译">
      <Row gutter={[16, 16]} className="language-row">
        <Col xs={24} sm={11}>
          <LanguageSelector value={sourceLanguage} onChange={onSourceLanguageChange} label="源语言" />
        </Col>
        <Col xs={24} sm={2} style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 24 }}>
          <Button icon={<SwapOutlined />} onClick={onSwapLanguages} disabled={sourceLanguage === "auto" || loading} />
        </Col>
        <Col xs={24} sm={11}>
          <LanguageSelector value={targetLanguage} onChange={onTargetLanguageChange} allowAuto={false} label="目标语言" />
        </Col>
      </Row>

      <TextArea
        value={sourceText}
        onChange={handleTextChange}
        placeholder="请输入要翻译的文本"
        autoSize={{ minRows: 6, maxRows: 12 }}
        maxLength={maxChars + 1}
        showCount={{
          formatter: ({ count }) => `${count}/${maxChars}`,
        }}
        status={isOverLimit ? "error" : ""}
      />

      <div className="translation-controls">
        <Space>
          <Button type="primary" onClick={handleTranslate} loading={loading}>
            翻译
          </Button>
          <Select
            value={state.modelType}
            style={{ width: 120 }}
            onChange={(e) => dispatch(setModelType(e))}
            options={[
              { value: "deepseek/deepseek-chat-v3-0324:free", label: "deepseek/deepseek-chat-v3-0324:free" },
              { value: "deepseek/deepseek-r1:free", label: "deepseek/deepseek-r1:free" },
              { value: "qwen/qwen2.5-vl-32b-instruct:free", label: "qwen/qwen2.5-vl-32b-instruct:free" },
              { value: "google/gemini-2.5-pro-exp-03-25:free", label: "google/gemini-2.5-pro-exp-03-25:free", disabled: true },
            ]}
          />
          <FileUploader onFileContent={handleFileContent} />
        </Space>

        <Text type={isOverLimit ? "danger" : undefined}>{isOverLimit ? "文本超出限制" : ""}</Text>
      </div>

      {result && (
        <div className="result-card">
          <div style={{ marginBottom: 8 }}>
            <Space>
              <Text type="secondary">翻译结果</Text>
              <Button type="text" icon={<SoundOutlined />} onClick={speakText} danger={isSpeaking} title="仅支持英文和中文" />
              <Button type="text" icon={<CopyOutlined />} onClick={copyResult} />
            </Space>
          </div>
          <Paragraph>
            <div dangerouslySetInnerHTML={{ __html: translatedText }}></div>
          </Paragraph>

          {/* 添加推荐模块 */}
          {result.recommendations && <RecommendationsSection recommendations={result.recommendations} />}
        </div>
      )}
    </StyledCard>
  );
}
