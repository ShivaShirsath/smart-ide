import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

// Suppress ResizeObserver loop errors (standard fix for Monaco Editor and similar components)
if (typeof window !== "undefined") {
  const resizeObserverHandler = e => {
    const msg = e.message || (e.error && e.error.message);
    if (msg && (msg.includes('ResizeObserver loop completed') || msg.includes('ResizeObserver loop limit exceeded'))) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  };
  window.addEventListener('error', resizeObserverHandler);
  window.addEventListener('unhandledrejection', resizeObserverHandler);
}

ReactDOM.createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
);
