import React, { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

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
			{loading ? (
				<loading></loading>
			) : (
				<>
					{error && error}
					<header>
						<img src="/code-sync.png" alt="logo" />
					</header>
					<section>
						<pre id="user">{username}</pre>
						<input
							type="text"
							id="id"
							placeholder="ROOM ID"
							onChange={(e) => setRoomId(e.target.value)}
							value={roomId}
							onKeyUp={handleInputEnter}
						/>
					</section>
					<section>
						<input
							type="button"
							id="join"
							onClick={joinRoom}
							value="Join Room"
						/>
						<input
							onClick={createNewRoom}
							type="button"
							id="new"
							value="Create Room"
						/>
					</section>
					<footer>
						<h4>
							Built with 💛 by{" "}
							<a href="https://github.com/ShivaShirsath/smart-ide">SMART-IDE</a>
						</h4>
					</footer>
				</>
			)}
			<button onClick={handleLogout}>
				<h1>⎋</h1>
			</button>
		</main>
	);
};

export default Home;
