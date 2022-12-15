import React, { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import Tilt from "react-parallax-tilt";

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
		<main>
			<section id="tilt">
				<Tilt
					className="parallax-effect"
					perspective={2000}
					glareEnable={true}
					glareMaxOpacity={0.5}
					glareColor="#ffffff"
					glarePosition="center"
					glareBorderRadius="2.5vmin">
					<div className="inner-element">
						<div id="form">
							<pre>{error && error}</pre>
							<section>
								<h1>Sign In</h1>
							</section>
							<section>
								<button id="google" onClick={signIn}></button>
								<button id="github" onClick={signIn}></button>
							</section>
						</div>
					</div>
				</Tilt>
			</section>
		</main>
	);
};

export default SocialSignIn;
