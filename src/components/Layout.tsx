import { ReactNode } from "react";
import { Layout as AntLayout } from "antd";
import styled from "styled-components";

const { Header, Content, Footer } = AntLayout;

interface LayoutProps {
  children: ReactNode;
}

const StyledLayout = styled(AntLayout)`
  min-height: 100vh;

  .header {
    background: #1890ff;
    padding: 0 24px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;

    h1 {
      margin: 0;
      font-size: 24px;
      color: white;
    }

    .header-action {
      display: flex;
      align-items: center;
    }
  }

  .content {
    padding: 24px;

    @media (max-width: 768px) {
      padding: 16px;
    }
  }

  .footer {
    text-align: center;
    background: #f0f2f5;
  }
`;

export default function Layout({ children }: LayoutProps) {
  return (
    <StyledLayout>
      <Header className="header">
        <h1>翻译助手</h1>
        <div className="header-action">{/* 可以添加语言切换、主题切换等功能按钮 */}</div>
      </Header>
      <Content className="content">{children}</Content>
      <Footer className="footer">翻译助手 ©{new Date().getFullYear()} Created with React & Ant Design</Footer>
    </StyledLayout>
  );
}
