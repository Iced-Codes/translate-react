import { useState } from "react";
import { Upload, message, Progress } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import styled from "styled-components";
import mammoth from "mammoth";
import { FileUploadResult } from "../types";

const { Dragger } = Upload;
console.log("🚀 ~ Dragger:", Dragger);

interface FileUploaderProps {
  onFileContent: (content: FileUploadResult) => void;
  maxSize?: number; // 最大文件大小(MB)
}

const StyledUploader = styled.div`
  margin: 16px 0;

  .ant-upload-list {
    margin-top: 8px;
  }

  .progress-container {
    margin-top: 12px;
  }
`;

export default function FileUploader({ onFileContent, maxSize = 5 }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = async (file: File) => {
    // 验证文件大小
    const fileSizeMB = file.size / 1024 / 1024;
    if (fileSizeMB > maxSize) {
      message.error(`文件大小不能超过${maxSize}MB`);
      return Upload.LIST_IGNORE;
    }

    // 验证文件类型
    const validTypes = [".txt", ".docx"];
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validTypes.includes(fileExt)) {
      message.error(`只支持${validTypes.join(", ")}格式文件`);
      return Upload.LIST_IGNORE;
    }

    setUploading(true);
    setProgress(0);

    try {
      let content = "";

      // 模拟进度
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 10;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return newProgress;
        });
      }, 100);

      // 根据文件类型处理文件
      if (fileExt === ".txt") {
        const text = await readTextFile(file);
        content = text;
      } else if (fileExt === ".docx") {
        const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
        content = result.value;
      }

      clearInterval(progressInterval);
      setProgress(100);

      // 处理完成
      onFileContent({
        content,
        fileName: file.name,
        fileType: fileExt.replace(".", ""),
        size: file.size,
      });

      message.success(`文件"${file.name}"已成功解析`);

      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 1000);
    } catch (error) {
      console.error("文件处理错误:", error);
      message.error("文件处理失败");
      setUploading(false);
      setProgress(0);
    }

    return Upload.LIST_IGNORE;
  };

  // 读取文本文件
  const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  return (
    <StyledUploader>
      {/* <Dragger name="file" multiple={false} showUploadList={false} beforeUpload={handleFile} disabled={uploading}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域</p>
        <p className="ant-upload-hint">支持 .txt, .docx 格式文件, 最大 {maxSize}MB</p>
      </Dragger> */}

      {uploading && (
        <div className="progress-container">
          <Progress percent={progress} status={progress === 100 ? "success" : "active"} />
        </div>
      )}
    </StyledUploader>
  );
}
