import React from "react"
import { AuthProvider } from "./firebase/AuthContext"
import { BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom"
import Dashboard from "./activities/Dashboard"
import PrivateRoute from "./firebase/PrivateRoute"

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <PrivateRoute exact path="/" component={Dashboard} />
          <Route path="*"><Redirect to="/" /></Route>
        </Switch>
      </AuthProvider>
    </Router>
  )
}

export default App
