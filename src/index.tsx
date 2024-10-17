import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {AuthProvider} from "./context/AuthContext";
import {Toaster} from "react-hot-toast";


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <AuthProvider>
          <Toaster/>
    <App />
      </AuthProvider>
  </React.StrictMode>
);


