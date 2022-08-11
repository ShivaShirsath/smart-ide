import React, { useContext, useState, useEffect } from "react"
import { auth } from "./firebase"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const provider = new GoogleAuthProvider();
  
  function login() {
    return signInWithPopup(auth, provider)
    .then((result) => {})
    .catch((error) => {
      console.log(error)
    });
  }

  function logout() {
    return auth.signOut()
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
