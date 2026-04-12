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
    if (!user) {
      setLoading(false);
      setUsername("Wait...");
      return;
    }

    try {
      const extractedName = user.displayName || 
                          (user.providerData && user.providerData[0] && user.providerData[0].displayName) || 
                          (user.email ? user.email.split('@')[0].replace(/[0-9]/g, "").replace(".", " ") : "User");
      
      setUsername(extractedName);
      setLoading(false);
    } catch (e) {
      console.error("Error extracting username:", e);
      setUsername("User");
      setLoading(false);
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
      <Tilt
        className="tilt"
        perspective={2000}
        glareEnable={true}
        glareMaxOpacity={0.45}
        glareColor="#ffffff"
        glareBorderRadius="2.5dvmin"
      >
        <div className="inner-element">
          {loading ? (
            <div id="inin"></div>
          ) : (
            <div className="form">
              {error && error}
              <section>
                  <img src="/android-chrome-512x512.png" alt="logo" />
              </section>
              <section>
                <input id="user" value={username} />
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
                <button
                  id="clear"
                  onClick={() => {
                    setRoomId("");
                  }}
                >
                  ╳
                </button>
                <button id="new" onClick={createNewRoom}>
                    +
                </button>
              </section>
                <section>
                  <button id="join" onClick={joinRoom}>
                    Join Room
                  </button>
                </section>
            </div>
          )}
        </div>
      </Tilt>
    </main>
  );
};

export default Home;
