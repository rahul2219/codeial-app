import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import { App } from './components/index';
import { AuthProvider, PostsProvider } from './providers/index';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <PostsProvider>
        <App />
      </PostsProvider>
    </AuthProvider>
  </React.StrictMode>
);
