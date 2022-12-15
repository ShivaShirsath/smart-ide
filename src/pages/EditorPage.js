import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import ACTIONS from "../Actions";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import Tilt from "react-parallax-tilt";

const EditorPage = () => {
	const socketRef = useRef(null);
	const codeRef = useRef(null);
	const location = useLocation();
	const reactNavigator = useNavigate();
	const [clients, setClients] = useState([]);
	const [html, setHtml] = useState("");
	useEffect(() => {
		const init = async () => {
			socketRef.current = await initSocket();
			socketRef.current.on("connect_error", (err) => handleErrors(err));
			socketRef.current.on("connect_failed", (err) => handleErrors(err));

			function handleErrors(e) {
				console.log("socket error", e);
				toast("Socket connection failed, try again later.", {
					icon: "❌",
				});
				reactNavigator("/");
			}

			socketRef.current.emit(ACTIONS.JOIN, {
				roomId: location.state?.roomId,
				photo: location.state?.photo,
				username: location.state?.username,
			});

			// Listening for joined event
			socketRef.current.on(
				ACTIONS.JOINED,
				({ clients, username, socketId }) => {
					if (username !== location.state?.username) {
						toast(`${username} joined the room.`, {
							icon: "🤝",
						});
						console.log(`${username} joined`);
					}
					setClients(clients);
					socketRef.current.emit(ACTIONS.SYNC_CODE, {
						code: codeRef.current,
						socketId,
					});
				},
			);

			// Listening for disconnected
			socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
				toast(`${username} left the room.`, {
					icon: "☹",
				});
				setClients((prev) => {
					return prev.filter((client) => client.socketId !== socketId);
				});
			});
		};
		init();
		return () => {
			socketRef.current.disconnect();
			socketRef.current.off(ACTIONS.JOINED);
			socketRef.current.off(ACTIONS.DISCONNECTED);
		};
	}, []);

	if (!location.state) {
		return <Navigate to="/" />;
	}

	async function copyRoomId() {
		try {
			await navigator.clipboard.writeText(location.state?.roomId);
			toast("Room ID has been copied to your Clipboard !", {
				icon: "📋",
			});
		} catch (err) {
			toast("Could not copy the Room ID", {
				icon: "❌",
			});
			console.error(err);
		}
	}

	function vInput() {}

	function leaveRoom() {
		reactNavigator("/");
	}

	return (
		<main>
			<section id="tilt">
				<Tilt
					className="parallax-effect"
					perspective={5500}
					glareEnable={true}
					glareMaxOpacity={0.5}
					glareColor="#ffffff"
					glarePosition="center"
					glareBorderRadius="2.5vmin">
					<div className="inner-element">
						<div>
							<div className="mainWrap">
								<button className="vin" onClick={vInput}>
									🎙
								</button>
								<div className="aside">
									<img src="/code-sync.png" alt="logo" />

									<div className="asideInner">
										<h3>Members</h3>
										<div className="clientsList">
											{clients.map((client) => (
												<Client
													key={client.socketId}
													photo={client.photo}
													username={client.username}
												/>
											))}
										</div>
									</div>
									<button id="copy" onClick={copyRoomId}>
										Copy ROOM ID
									</button>
									<button id="leave" onClick={leaveRoom}>
										Leave ROOM
									</button>
								</div>
								<div className="editorWrap">
									<iframe title="output" srcDoc={html} />
									<Editor
										socketRef={socketRef}
										roomId={location.state?.roomId}
										onCodeChange={(code) => {
											codeRef.current = code;
											setHtml(codeRef.current);
										}}
									/>
								</div>
							</div>
						</div>
					</div>
				</Tilt>{" "}
			</section>{" "}
		</main>
	);
};

export default EditorPage;
