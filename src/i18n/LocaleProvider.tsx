import { ReactNode, useState, useMemo } from "react";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import enUS from "antd/es/locale/en_US";
import { LocaleContext, SupportedLocale, DEFAULT_LOCALE, translate } from "./index";

// Ant Design 语言包映射
const antdLocales = {
  [SupportedLocale.ZH]: zhCN,
  [SupportedLocale.EN]: enUS,
};

interface LocaleProviderProps {
  children: ReactNode;
  initialLocale?: SupportedLocale;
}

export default function LocaleProvider({ children, initialLocale = DEFAULT_LOCALE }: LocaleProviderProps) {
  // 从本地存储中获取语言设置，如果没有则使用默认值
  const savedLocale = localStorage.getItem("locale") as SupportedLocale;
  const [locale, setLocale] = useState<SupportedLocale>(
    savedLocale && Object.values(SupportedLocale).includes(savedLocale) ? savedLocale : initialLocale
  );

  // 设置语言并保存到本地存储
  const handleSetLocale = (newLocale: SupportedLocale) => {
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  // 翻译函数
  const t = useMemo(() => {
    return (key: string, params?: Record<string, string | number>) => translate(locale, key, params);
  }, [locale]);

  // 创建国际化上下文值
  const contextValue = useMemo(
    () => ({
      locale,
      setLocale: handleSetLocale,
      t,
    }),
    [locale, t]
  );

  return (
    <LocaleContext.Provider value={contextValue}>
      <ConfigProvider locale={antdLocales[locale]}>{children}</ConfigProvider>
    </LocaleContext.Provider>
  );
}
