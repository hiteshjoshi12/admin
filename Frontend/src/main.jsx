import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

// REDUX IMPORTS
import { Provider } from 'react-redux';
import store from './redux/store';

// Automatically reload when a lazy chunk fails to load due to a new deployment
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  const reloadKey = 'bb_chunk_reload';
  if (!sessionStorage.getItem(reloadKey)) {
    sessionStorage.setItem(reloadKey, 'true');
    window.location.reload();
  }
});

window.addEventListener('load', () => {
  sessionStorage.removeItem('bb_chunk_reload');
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
);