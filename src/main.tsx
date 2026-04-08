// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './styles/global.css';

window.addEventListener('error', (event) => {
  const msg = event.message ?? '';
  if (msg.includes('Loading chunk') || msg.includes('ChunkLoadError') || msg.includes('Failed to fetch dynamically imported module')) {
    window.location.reload();
  }
});

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
