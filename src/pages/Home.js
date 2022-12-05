import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast("Created a new room", {
      icon: "✔",
    });
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast("ROOM ID & username is required", {
        icon: "🥺",
      });
      return;
    }

    // Redirect
    navigate(`/editor/${roomId}`, {
      state: {
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
    <div className="formWrapper">
      <header>
        <img src="/code-sync.png" alt="logo" />
      </header>
      <div className="inputGroup">
        <input
          type="text"
          id="id"
          placeholder="ROOM ID"
          onChange={(e) => setRoomId(e.target.value)}
          value={roomId}
          onKeyUp={handleInputEnter}
        />
        <input
          type="text"
          id="user"
          placeholder="USER NAME"
          minlength="3"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          onKeyUp={handleInputEnter}
        />
      </div>

      <div className="inputBtnGroup">
        <input
          type="button"
          id="join"
          onClick={joinRoom}
          value="Join with ID"
        />
        <input
          onClick={createNewRoom}
          type="button"
          id="new"
          value="NEW ROOM ID"
        />
      </div>
      <footer>
        <h4>
          Built with 💛 by &nbsp;
          <a href="https://github.com/ShivaShirsath/smart-ide">Smart-IDE</a>
        </h4>
      </footer>
    </div>
  );
};

export default Home;
