'use client';
import React from 'react';
// import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './pages/App.jsx';
import ErrorBoundary from './components/utils/error-boundarie/ErrorBoundarie.jsx';
import './index.css';

export function Dienstplaner() {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <Router basename="/dpl">
          <App />
        </Router>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

export default Dienstplaner;
