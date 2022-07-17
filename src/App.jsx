import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EditorPage from "./components/editor/EditorPage";

import Home from "./components/home/Home";

function App() {
  return (
    <div className="App">
      <div>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              duration: 800,
              theme: {
                primary: "#4aed88",
              },
            },
          }}
        ></Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:roomid" element={<EditorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
