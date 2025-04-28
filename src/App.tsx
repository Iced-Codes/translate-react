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
  document.cookie =
    "__client_uat=1743521713;__client_uat_NO6jtgZM=1743521713; __refresh_NO6jtgZM=3vkGnPvZLXaawv2CfsIR; ph_phc_yQgAEdJJkVpI24NdSRID2mor1x1leRpDoC9yZ9mfXal_posthog=%7B%22distinct_id%22%3A%220195f216-2cf0-765f-805f-049c61748c00%22%2C%22%24sesid%22%3A%5B1743530663508%2C%220195f286-824a-7fe8-a1c5-76b898f3d6e0%22%2C1743530656330%5D%7D; ph_phc_7ToS2jDeWBlMu4n2JoNzoA1FnArdKwFMFoHVnAqQ6O1_posthog=%7B%22distinct_id%22%3A%22user_2v8LNQFIby6IF6G9etBssNT9PIZ%22%2C%22%24sesid%22%3A%5B1745839734518%2C%2201967c27-0fcb-7949-bc12-296153ee9e56%22%2C1745839656907%5D%2C%22%24epp%22%3Atrue%2C%22%24initial_person_info%22%3A%7B%22r%22%3A%22https%3A%2F%2Fwww.bing.com%2F%22%2C%22u%22%3A%22https%3A%2F%2Fopenrouter.ai%2F%22%7D%7D; __session_NO6jtgZM=eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18yUGlRcWt2UlFlZXB3R3ZrVjFZRDhBb3Q1elIiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwczovL29wZW5yb3V0ZXIuYWkiLCJleHAiOjE3NDU4NDA4ODgsImZ2YSI6WzM4NjUyLC0xXSwiaWF0IjoxNzQ1ODQwODI4LCJpc3MiOiJodHRwczovL2NsZXJrLm9wZW5yb3V0ZXIuYWkiLCJuYmYiOjE3NDU4NDA4MTgsInNpZCI6InNlc3NfMnY4TE5PQVM5MjhBTWdOYzczb0tWYkxZZFREIiwic3ViIjoidXNlcl8ydjhMTlFGSWJ5NklGNkc5ZXRCc3NOVDlQSVoifQ.TjI67qavrvY5DAgvdYGe-ihKB2VvLedUBFD9teWtgg1fVDvGw5nJ72SlTWUFOO_lhnF5dVg3rCOLuJxczPxQ4aTaA-dxwjX2vf7WSNxvFx5u5sP7S6eVTK2PRmfMaqkKr47zK8KR20FlJb9rrwmH9ad1Acw1C5wAwMlGdFBYytE-HS7EfD1Wot9djrEarVwkPNlNPDTxcjPwSO5mGyP0TMyIej3lImPDcQQynFnt2XpTIhuzeiTxtgI9csQ_DHUgsIHnTq0JM9kS-FV2EmMAc8K477mWtbnp5Chcty2Xl15nWL6-HfpCCzrxuk7Bj6mQlGZmQgwrvV0qZTFOgJj8FA; __session=eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18yUGlRcWt2UlFlZXB3R3ZrVjFZRDhBb3Q1elIiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwczovL29wZW5yb3V0ZXIuYWkiLCJleHAiOjE3NDU4NDA4ODgsImZ2YSI6WzM4NjUyLC0xXSwiaWF0IjoxNzQ1ODQwODI4LCJpc3MiOiJodHRwczovL2NsZXJrLm9wZW5yb3V0ZXIuYWkiLCJuYmYiOjE3NDU4NDA4MTgsInNpZCI6InNlc3NfMnY4TE5PQVM5MjhBTWdOYzczb0tWYkxZZFREIiwic3ViIjoidXNlcl8ydjhMTlFGSWJ5NklGNkc5ZXRCc3NOVDlQSVoifQ.TjI67qavrvY5DAgvdYGe-ihKB2VvLedUBFD9teWtgg1fVDvGw5nJ72SlTWUFOO_lhnF5dVg3rCOLuJxczPxQ4aTaA-dxwjX2vf7WSNxvFx5u5sP7S6eVTK2PRmfMaqkKr47zK8KR20FlJb9rrwmH9ad1Acw1C5wAwMlGdFBYytE-HS7EfD1Wot9djrEarVwkPNlNPDTxcjPwSO5mGyP0TMyIej3lImPDcQQynFnt2XpTIhuzeiTxtgI9csQ_DHUgsIHnTq0JM9kS-FV2EmMAc8K477mWtbnp5Chcty2Xl15nWL6-HfpCCzrxuk7Bj6mQlGZmQgwrvV0qZTFOgJj8FA";
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
