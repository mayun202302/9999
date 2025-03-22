import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { useTranslation } from 'react-i18next';
import Home from './pages/Home';
import Admin from './pages/Admin';
import './i18n';

const { Header, Content, Footer } = Layout;

function App() {
  const { i18n } = useTranslation();

  const changeLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  return (
    <ConfigProvider locale={i18n.language === 'zh' ? zhCN : enUS}>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Header style={{ 
            background: '#fff', 
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h1 style={{ margin: 0 }}>TRX Energy Rental</h1>
            <button 
              onClick={changeLanguage}
              style={{
                padding: '8px 16px',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                background: '#fff',
                cursor: 'pointer'
              }}
            >
              {i18n.language === 'zh' ? 'English' : '中文'}
            </button>
          </Header>
          <Content style={{ padding: '24px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            TRX Energy Rental System ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App; 