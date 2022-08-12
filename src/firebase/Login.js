import React, { useState } from "react"
import { useAuth } from "./AuthContext"
import { useHistory } from "react-router-dom"

export default function Login() {
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await login()
      history.push("/")
    } catch {
      setError("Failed to log in")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={ handleSubmit }>
      <h2 align="center">Log In</h2>
      {error && <span>{error}</span>}
      <button id="google" disabled={loading} type="submit" >
      </button>
    </form>
  )
}
