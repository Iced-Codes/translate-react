import { Row, Col } from "antd";
import { useTranslation } from "./hooks/useTranslation";
import Layout from "./components/Layout";
import TranslationForm from "./features/translation/TranslationForm";
import RecommendationPanel from "./features/recommendations/RecommendationPanel";
import ErrorBoundary from "./components/ErrorBoundary";
import { useLocale } from "./i18n";
import styled from "styled-components";

const AppContainer = styled.div`
  .translation-container {
    // display: flex;
    // flex-direction: column;
    gap: 16px;

    @media (min-width: 992px) {
      flex-direction: row;

      .translation-form {
        flex: 7;
      }

      .recommendation-panel {
        flex: 3;
      }
    }
  }
`;

export default function App() {
  const { sourceLanguage, targetLanguage, setSourceLanguage, setTargetLanguage, translate, result, loading, swapLanguages } =
    useTranslation();

  const { t } = useLocale();

  return (
    <ErrorBoundary>
      <AppContainer>
        <Layout>
          <div className="translation-container">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={16} className="translation-form">
                <TranslationForm
                  sourceLanguage={sourceLanguage}
                  targetLanguage={targetLanguage}
                  onSourceLanguageChange={setSourceLanguage}
                  onTargetLanguageChange={setTargetLanguage}
                  onTranslate={translate}
                  onSwapLanguages={swapLanguages}
                  loading={loading}
                  result={result}
                />
              </Col>
              <Col xs={24} lg={8} className="recommendation-panel">
                <RecommendationPanel result={result} />
              </Col>
            </Row>
          </div>
        </Layout>
      </AppContainer>
    </ErrorBoundary>
  );
}
