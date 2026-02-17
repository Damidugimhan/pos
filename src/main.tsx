import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';
import { App } from './App';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { authService } from './services/authService';

void authService.loadProfile().catch(() => null);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
      <Toaster richColors position="top-right" />
    </ErrorBoundary>
  </React.StrictMode>
);
