import { Card, Tag, Empty, Spin, Tabs, Typography } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useRecommendations } from "../../hooks/useRecommendations";
import { RecommendationItem, TranslationResult } from "../../types";

const { TabPane } = Tabs;
const { Title } = Typography;

interface RecommendationPanelProps {
  result: TranslationResult | null;
}

const StyledCard = styled(Card)`
  .tags-container {
    margin-top: 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .ant-empty {
    margin: 32px 0;
  }
`;

// 颜色列表，用于标签云展示
const COLORS = ["#108ee9", "#2db7f5", "#87d068", "#f50", "#13c2c2", "#722ed1"];

export default function RecommendationPanel({ result }: RecommendationPanelProps) {
  const { recommendations, loading, getFrequentTerms } = useRecommendations(result);
  const [frequentTerms, setFrequentTerms] = useState<RecommendationItem[]>([]);

  // 获取历史频率词汇
  useEffect(() => {
    setFrequentTerms(getFrequentTerms());
  }, [getFrequentTerms, result]);

  // 根据频率生成标签大小
  const getTagSize = (frequency: number = 1): number => {
    // 根据频率调整字体大小，范围从12px到18px
    return Math.max(12, Math.min(18, 12 + frequency * 2));
  };

  // 获取随机颜色
  const getRandomColor = (index: number): string => {
    return COLORS[index % COLORS.length];
  };

  const renderTags = (items: RecommendationItem[]) => {
    if (items.length === 0) {
      return <Empty description="暂无推荐" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    return (
      <div className="tags-container">
        {items.map((item, index) => (
          <Tag key={item.text} color={getRandomColor(index)} style={{ fontSize: getTagSize(item.frequency), padding: "4px 8px" }}>
            {item.text}
          </Tag>
        ))}
      </div>
    );
  };

  const tabsItem = [
    {
      label: "当前翻译",
      key: "current",
      children: <Spin spinning={loading}>{renderTags(recommendations)}</Spin>,
    },
    {
      label: "历史推荐",
      key: "history",
      children: renderTags(frequentTerms),
    },
  ];
  return (
    <StyledCard title="相关推荐">
      <Tabs defaultActiveKey="current" items={tabsItem}></Tabs>
    </StyledCard>
  );
}
