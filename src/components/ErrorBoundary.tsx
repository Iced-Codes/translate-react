import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button, Result } from "antd";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 更新 state，下次渲染时显示错误UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 可以在这里记录错误日志
    console.error("组件错误:", error);
    console.error("错误详情:", errorInfo);
  }

  handleReset = (): void => {
    // 重置错误状态
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // 自定义回退UI或使用默认错误展示
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Result
          status="error"
          title="应用程序出错了"
          subTitle={this.state.error?.message || "发生了未知错误"}
          extra={[
            <Button key="refresh" type="primary" onClick={() => window.location.reload()}>
              刷新页面
            </Button>,
            <Button key="reset" onClick={this.handleReset}>
              尝试恢复
            </Button>,
          ]}
        />
      );
    }

    // 没有错误就正常渲染子组件
    return this.props.children;
  }
}
