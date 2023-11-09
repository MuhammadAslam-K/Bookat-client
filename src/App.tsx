import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ChakraProvider } from '@chakra-ui/react'


import './App.css';
import DriverRoutes from "./routers/driverRouter/DriverRouters.js";
import AdminRoutes from "./routers/adminRouter/AdminRouters.js";
import UserRoutes from "./routers/userRouter/UserRouters.js";
// import ChatModal from "./components/Chat.js";



function App() {

  return (
    <>
      <Toaster />
      <ChakraProvider />
      <Router>
        <Routes>

          <Route path="/*" element={<UserRoutes />} />
          <Route path="/driver/*" element={<DriverRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />


          {/* <Route path="/chat" element={<ChatModal />} /> */}

        </Routes>
      </Router >
    </>
  );
}

export default App
