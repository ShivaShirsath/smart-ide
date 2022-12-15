import React, { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import Tilt from "react-parallax-tilt";

const Home = () => {
	const navigate = useNavigate();

	const { user, logout } = UserAuth();
	const [error, setError] = useState("");
	const [roomId, setRoomId] = useState("");
	const [username, setUsername] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(false);
		if (!user) {
			setUsername("Wait...");
		} else {
			try {
				if (!user.displayName)
					if (!user.providerData.displayName)
						if (!user.email) setUsername("UserName");
						else
							setUsername(
								user.email
									.replace("@gmail.com", "")
									.replace(/[0-9]/g, "")
									.replace(".", " "),
							);
					else setUsername(user.providerData.displayName);
				else setUsername(user.displayName);
			} catch (e) {
				setLoading(true);
			}
		}
	}, [user]);

	const handleLogout = async () => {
		setError("");
		try {
			await logout();
		} catch (e) {
			setError(JSON.stringify(e, undefined, 2));
		}
	};
	const createNewRoom = (e) => {
		e.preventDefault();
		const id = uuidV4();
		setRoomId(id);
		toast("Created a new room", {});
	};

	const joinRoom = () => {
		if (!roomId || !username) {
			toast("ROOM ID & username is required", {
				icon: "🥺",
			});
			return;
		}

		// Redirect
		navigate(`/editor`, {
			state: {
				roomId,
				photo: user.photoURL,
				username,
			},
		});
	};

	const handleInputEnter = (e) => {
		if (e.code === "Enter") {
			joinRoom();
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
						{loading ? (
							<loading></loading>
						) : (
							<div id="form">
								{error && error}
								<section>
									<img src="/code-sync.png" alt="logo" />
								</section>
								<section>
									<input id="user" value={username} disabled />
									<button onClick={handleLogout}>⎋</button>
								</section>
								<section>
									<input
										type="text"
										id="id"
										placeholder="ROOM ID"
										onChange={(e) => setRoomId(e.target.value)}
										value={roomId}
										onKeyUp={handleInputEnter}
									/>
									<button onClick={createNewRoom}>╋</button>
								</section>
								<section>
									<input
										type="button"
										id="join"
										onClick={joinRoom}
										value="Join Room"
									/>
								</section>
							</div>
						)}
					</div>
				</Tilt>
			</section>
		</main>
	);
};

export default Home;
