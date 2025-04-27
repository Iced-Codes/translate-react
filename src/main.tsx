import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import LocaleProvider from "./i18n/LocaleProvider";
import { ConfigProvider, theme } from "antd";
import { Provider } from "react-redux";
import store from "./store";
import "./index.css";
import "@ant-design/v5-patch-for-react-19";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: "#1890ff",
          },
        }}>
        <LocaleProvider>
          <App />
        </LocaleProvider>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);
