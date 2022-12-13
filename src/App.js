import React from "react";
import Account from "./components/Account";
import { Route, Routes } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";

function App() {
	return (
		<AuthContextProvider>
			<Routes>
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<Account />
						</ProtectedRoute>
					}
				/>
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</AuthContextProvider>
	);
}

export default App;
