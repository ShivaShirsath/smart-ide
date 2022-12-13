import React, { useState } from "react";
import { UserAuth } from "../context/AuthContext";

const Account = () => {
	const { user, logout } = UserAuth();
	const [error, setError] = useState("");

	const handleLogout = async () => {
		setError("");
		try {
			await logout();
		} catch (e) {
			setError(JSON.stringify(e, undefined, 2));
		}
	};

	return (
		<>
			{user && (
				<>
					<h1>Account</h1>
					<pre>{error && error}</pre>
					<img src={user.photoURL} alt="photoURL" />
					<pre>{JSON.stringify(user, undefined, 2)}</pre>
					<button onClick={handleLogout}>Logout</button>
				</>
			)}
		</>
	);
};

export default Account;
