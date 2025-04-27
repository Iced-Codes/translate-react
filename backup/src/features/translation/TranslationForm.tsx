import { Card, Input, Button, Space, Upload, message } from "antd";
import { UploadOutlined, SwapOutlined } from "@ant-design/icons";

type TranslationFormProps = {
  onTranslate: (text: string) => void;
  loading: boolean;
};

export default function TranslationForm({ onTranslate, loading }: TranslationFormProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.length > 5000) {
      message.error("Text exceeds 5000 character limit");
      return;
    }
    onTranslate(text);
  };

  return (
    <Card title="Translation" className="translation-card">
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Input.TextArea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to translate (max 5000 characters)"
          showCount
          maxLength={5000}
        />
        <Space>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            Translate
          </Button>
          <Upload
            beforeUpload={(file) => {
              // Handle file upload logic
              return false;
            }}
            showUploadList={false}>
            <Button icon={<UploadOutlined />}>Upload File</Button>
          </Upload>
          <Button icon={<SwapOutlined />} />
        </Space>
      </Space>
    </Card>
  );
}
