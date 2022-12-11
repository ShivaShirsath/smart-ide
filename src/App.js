import Auth from "./components/auth";
import Dashboard from "./components/dashboard";
import { useUserContext } from "./context/userContext";

function App() {
  const { user, loading, error } = useUserContext();

  return (
    <div>
      {error && {error}}
      {loading ? <h2>Loading...</h2> : <> {user ? <Dashboard /> : <Auth />} </>}
    </div>
  );
}

export default App;
