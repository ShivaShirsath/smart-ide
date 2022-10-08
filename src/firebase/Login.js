import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useHistory } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
  try {
      setError("");
      setLoading(true);
      await login();
      history.push("/");
    } catch {
      setError("Failed to log in");
    }

    setLoading(false);
  }

  return (
    <stator>
      <h1 align="center">Log In</h1>
      {error && <span>{error}</span>}
      <img
        id="gbtn"
        alt="Google"
        src="https://upload.wikimedia.org/wikipedia/commons/archive/5/53/20210618182605%21Google_%22G%22_Logo.svg"
        disabled={loading}
        onClick={handleSubmit}/>
      </stator>
  );
}
