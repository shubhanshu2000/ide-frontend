import React from "react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [roomid, setRoomId] = useState("");
  const [name, setName] = useState("");
  const GenerateNewRoomId = (e) => {
    e.preventDefault();
    toast.success(" Room Id Generated");
    setRoomId(uuidv4());
  };
  const joinRoom = (e) => {
    e.preventDefault();
    if (!roomid || !name) {
      toast.error("ROOM ID & username is required", {
        duration: 800,
        icon: "⚠",
      });
      return;
    }

    // Redirect
    navigate(`/editor/${roomid}`, {
      state: {
        name,
      },
    });
  };
  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };
  return (
    <>
      <div className="flex bg-blue-400 justify-center h-screen items-center">
        <div className="w-1/4   border-2 border-red-200">
          <form
            className="flex bg-pink-400 flex-col"
            onClick={(e) => e.preventDefault()}
          >
            <input
              className="pl-2"
              type="text"
              onChange={(e) => setRoomId(e.target.value)}
              value={roomid}
              onKeyUp={handleInputEnter}
              placeholder="Room Id"
            />
            <input
              type="text"
              className="pl-2"
              onChange={(e) => setName(e.target.value)}
              value={name}
              onKeyUp={handleInputEnter}
              placeholder="Enter your username"
            />
            <div className="flex justify-between">
              <button type="submit" onClick={joinRoom}>
                JOIN
              </button>
              <button onClick={GenerateNewRoomId}>Generate RoomID</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Home;
