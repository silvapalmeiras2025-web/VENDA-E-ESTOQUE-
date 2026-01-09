
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';

console.log("Iniciando ConstruFlow ERP...");

const container = document.getElementById('root');

if (!container) {
  console.error("Erro Crítico: Elemento #root não encontrado no DOM.");
} else {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <HashRouter>
          <App />
        </HashRouter>
      </React.StrictMode>
    );
    console.log("Renderização inicial concluída.");
  } catch (error) {
    console.error("Erro durante a renderização inicial do React:", error);
    container.innerHTML = `<div style="padding: 20px; color: red; font-family: sans-serif;">
      <h2>Erro de Inicialização</h2>
      <pre>${error instanceof Error ? error.message : String(error)}</pre>
    </div>`;
  }
}
