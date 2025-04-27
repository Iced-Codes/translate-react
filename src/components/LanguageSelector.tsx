import { useEffect, useState } from "react";
import { Select } from "antd";
import { TranslationOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { LanguageCode } from "../types";
import { getSupportedLanguages } from "../utils/api";

interface LanguageSelectorProps {
  value: LanguageCode | "auto";
  onChange: (value: LanguageCode | "auto") => void;
  allowAuto?: boolean;
  label?: string;
}

const StyledSelector = styled.div`
  display: flex;
  flex-direction: column;

  .select-label {
    margin-bottom: 4px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
  }

  .language-select {
    width: 100%;
  }
`;

export default function LanguageSelector({ value, onChange, allowAuto = true, label }: LanguageSelectorProps) {
  const [languages, setLanguages] = useState<{ code: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取支持的语言列表
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const langs = await getSupportedLanguages();
        // 如果不允许自动检测，则过滤掉auto选项
        const filteredLangs = allowAuto ? langs : langs.filter((lang) => lang.code !== "auto");
        setLanguages(filteredLangs);
      } catch (error) {
        console.error("获取语言列表失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, [allowAuto]);

  return (
    <StyledSelector>
      {label && <div className="select-label">{label}</div>}
      <Select
        className="language-select"
        value={value}
        onChange={onChange}
        loading={loading}
        optionFilterProp="label"
        showSearch
        placeholder="选择语言"
        suffixIcon={<TranslationOutlined />}
        options={languages.map((lang) => ({
          value: lang.code,
          label: lang.name,
        }))}
      />
    </StyledSelector>
  );
}
