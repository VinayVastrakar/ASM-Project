import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Layout from './components/layout/Layout';
import AuthRoutes from './routes/AuthRoutes';
import AppRoutes from './routes/AppRoutes';

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
      <Provider store={store}>
        <Router>
          <AuthRoutes />
          <Layout>
            <AppRoutes />
          </Layout>
        </Router>
      </Provider>
    </GoogleOAuthProvider>
  );
};

export default App;