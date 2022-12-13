import React, { useState } from "react";
import { UserAuth } from "../context/AuthContext";

const SocialSignIn = () => {
	const { signInWith } = UserAuth();
	const [error, setError] = useState("");

	const signIn = async (e) => {
		setError("");
		try {
			await signInWith(e.target.id === "google");
		} catch (e) {
			setError(JSON.stringify(e, undefined, 2));
		}
	};

	return (
		<div>
			<div>
				<h1>Sign In</h1>
				<pre>{error && error}</pre>
			</div>
			<button id="google" onClick={signIn}>
				Google
			</button>
			<button id="github" onClick={signIn}>
				Github
			</button>
		</div>
	);
};

export default SocialSignIn;
