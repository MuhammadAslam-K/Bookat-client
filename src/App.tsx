import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import SignUp from "./components/signup/SignUp.jsx";
import './App.css';

function App() {
  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          <Route element={<SignUp />} path="/" />
        </Routes>
      </Router>
    </>
  );
}

export default App;
