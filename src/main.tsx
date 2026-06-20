import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { DataProvider } from './context/DataContext';
import { ModalProvider } from './context/ModalContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <DataProvider>
          <ModalProvider>
            <App />
          </ModalProvider>
        </DataProvider>
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
);
