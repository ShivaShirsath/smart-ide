/* eslint-disable import/first */
/**
 * NUCLEAR FIX: ResizeObserver Loop Protection
 * This patch must be at the absolute top of the index file to wrap the global
 * ResizeObserver before any components (like Monaco) are initialized.
 */
if (typeof window !== "undefined") {
  const OriginalResizeObserver = window.ResizeObserver;
  window.ResizeObserver = class ResizeObserver extends OriginalResizeObserver {
    constructor(callback) {
      super((entries, observer) => {
        // Use requestAnimationFrame to defer the callback execution
        // This prevents the "ResizeObserver loop limit exceeded" error 
        // by pushing the work to the next animation frame.
        window.requestAnimationFrame(() => {
          if (!Array.isArray(entries) || !entries.length) return;
          try {
            callback(entries, observer);
          } catch (e) {
            console.warn('Suppressed ResizeObserver callback error:', e);
          }
        });
      });
    }
  };

  // Standard global error suppression as a secondary layer
  const suppressResizeObserverError = (e) => {
    const msg = e.message || (e.error && e.error.message) || "";
    if (msg.includes('ResizeObserver loop') || msg.includes('Script error.')) {
      e.stopImmediatePropagation();
      e.preventDefault();
      return true;
    }
  };
  window.addEventListener('error', suppressResizeObserverError);
  window.addEventListener('unhandledrejection', suppressResizeObserverError);
  window.onerror = (msg) => {
    if (msg && (
      msg.includes('ResizeObserver loop') || 
      msg.includes('Script error.') || 
      msg.includes('no diff result available')
    )) return true;
  };
}

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
);
