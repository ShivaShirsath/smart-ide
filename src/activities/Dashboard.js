import React, { useState, useEffect } from "react";
import { useAuth } from "../firebase/AuthContext";
import Editor from "./Editor";
import useLocalStorage from "../hooks/useLocalStorage";

function Dashboard() {
  const [html, setHtml] = useLocalStorage("html", "");
  const [css, setCss] = useLocalStorage("css", "");
  const [js, setJs] = useLocalStorage("js", "");
  const [srcDoc, setSrcDoc] = useState("");
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();

    useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
        <head>
          <style>${css}</style>
        </head>
        <body>${html}</body>
        <script>${js}</script>
        </html>
        `);
    }, 250);

    return () => clearTimeout(timeout);
  }, [html, css, js]);

  async function handleLogout() {
    setError("");

    try {
      await logout();
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <stator>
      {error && <span>{error}</span>}
      <iframe
        srcDoc={srcDoc}
        title="output"
        /* sandbox="allow-scripts" */
        frameBorder="0"
        width="100%"
        height="100%"
      />
      <rotor>
        <>
          {currentUser.displayName}
          <logout onClick={handleLogout}>⎋</logout>
        </>
        <Editor
          language="htmlmixed"
          displayName="HTML"
          value={html}
          onChange={setHtml}
        />
        <Editor
          language="css"
          displayName="CSS"
          value={css}
          onChange={setCss}
        />
        <Editor
          language="javascript"
          displayName="JS"
          value={js}
          onChange={setJs}
        />
      </rotor>
    </stator>
  );
}

export default Dashboard;
