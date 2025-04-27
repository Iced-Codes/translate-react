import { Layout, ConfigProvider } from "antd";
import { useTranslation } from "./features/translation/useTranslation";
import TranslationForm from "./features/translation/TranslationForm";
import RecommendationPanel from "./features/recommendations/RecommendationPanel";
import "./App.css";

const { Header, Content } = Layout;

function App() {
  const { translate, result, loading } = useTranslation();

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#1890ff" } }}>
      <Layout className="app-layout">
        <Header className="app-header">
          <h1>Translation App</h1>
        </Header>
        <Content className="app-content">
          <TranslationForm onTranslate={translate} loading={loading} />
          <RecommendationPanel result={result} />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
