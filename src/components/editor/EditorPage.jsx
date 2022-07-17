import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { initSocket } from "../Websocket/Socket";
import Avatar from "react-avatar";
import Split from "react-split";

import {
  useLocation,
  useParams,
  Navigate,
  useNavigate,
} from "react-router-dom";
import toast from "react-hot-toast";
import ACTIONS from "../../../Action";

function EditorPage() {
  const reactNavigator = useNavigate();
  const [resData, setResData] = useState("");
  const { roomid } = useParams();
  const [members, setMembers] = useState([]);
  const location = useLocation();
  const editorRef = useRef(null);
  const socktRef = useRef(null);

  function handleEditorMount(editor, monaco) {
    editorRef.current = editor;
  }
  useEffect(() => {
    if (socktRef.current) {
      socktRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          setResData(code);
        }
      });
    }
    return () => {
      if (socktRef.current) {
        socktRef.current.off(ACTIONS.CODE_CHANGE);
      }
    };
  }, [socktRef.current]);

  async function handleChange() {
    const code = editorRef.current.getValue();
    socktRef.current.emit(ACTIONS.CODE_CHANGE, {
      roomid,
      code,
    });
  }

  useEffect(() => {
    const init = async () => {
      socktRef.current = await initSocket();
      socktRef.current.on("connect_error", (err) => handleErr(err));
      socktRef.current.on("connect_failed", (err) => handleErr(err));

      function handleErr(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later");
        reactNavigator("/");
      }

      socktRef.current.emit(ACTIONS.JOIN, {
        roomid,
        name: location.state?.name,
      });

      //Listening for joined event
      socktRef.current.on(ACTIONS.JOINED, ({ members, name, socketId }) => {
        if (name !== location.state?.name) {
          toast.success(`${name} joined the room`);
        }
        setMembers(members);
      });
      //Listening for disconnected event
      socktRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, name }) => {
        toast.success(`${name} left the room`);
        setMembers((prev) => {
          return prev.filter((member) => member.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      //clean up code

      if (socktRef.current) {
        socktRef.current.off(ACTIONS.JOIN);
        socktRef.current.off(ACTIONS.JOINED);
        socktRef.current.off(ACTIONS.DISCONNECTED);
        socktRef.current.disconnect();
      }
    };
  }, []);
  async function showValue() {
    const code = await editorRef.current.getValue();
    const iframe = document.getElementById("result");
    iframe.contentWindow.eval(code);
  }

  if (!location.state) {
    <Navigate to="/" />;
  }

  function runOnCtrlPlusShift(e) {
    if (e.key === "Control" && "Shift") {
      showValue();
    }
  }
  async function copyRoomID() {
    try {
      await navigator.clipboard.writeText(roomid);
      toast.success("Room ID successfully copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy Room ID");
      console.error(err);
    }
  }
  function leaveRoom() {
    reactNavigator("/");
  }

  return (
    <>
      <div className="flex">
        <div className=" h-screen w-1/5 bg-blue-400">
          <aside className="">
            <h1 className="m-auto max-w-fit   text-lg">Members Connected</h1>
            <div className="flex flex-wrap m-auto max-w-full">
              {members.map(({ name, socketId }) => (
                <>
                  <div
                    key={socketId}
                    className="m-auto flex p-2 flex-col w-1/2"
                  >
                    <Avatar
                      // key={socketId}
                      className="m-auto"
                      name={name}
                      size="40"
                      round="10px"
                    />
                    <p className="font-semibold m-auto">{name}</p>
                  </div>
                </>
              ))}
            </div>
            <div className="absolute bottom-0 w-1/5 ">
              <div className=" flex items-center  justify-center">
                <button
                  className="bg-green-400 px-6 rounded-lg mb-2 items-center py-2"
                  title="Click to run code or press Ctrl+Shift to run code"
                  onClick={showValue}
                >
                  Run
                </button>
              </div>
              <div className="flex flex-wrap justify-around items-center">
                <button
                  className="bg-red-500 px-4 mb-2 py-2 rounded-lg font-semibold"
                  title="Click to copy Room ID"
                  onClick={copyRoomID}
                >
                  Copy Room ID
                </button>
                <button
                  className="bg-yellow-600 mb-2 px-10 font-semibold py-2 rounded-lg"
                  onClick={leaveRoom}
                  title="Click to leave room"
                >
                  Leave
                </button>
              </div>
            </div>
          </aside>
        </div>
        <div className="  w-4/5">
          <Split sizes={[70, 30]} minSize={[600, 200]} className="flex ">
            <div onKeyUp={runOnCtrlPlusShift}>
              <Editor
                className="ide h-screen"
                defaultLanguage="javascript"
                defaultValue="function hello (){ return alert('Hello World') } hello()"
                value={resData}
                onMount={handleEditorMount}
                onChange={handleChange}
                theme="vs-dark"
              />
            </div>
            <iframe id="result" className="result   "></iframe>
          </Split>
        </div>
      </div>
    </>
  );
}

export default EditorPage;
