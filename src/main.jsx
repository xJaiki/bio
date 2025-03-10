import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NavComponent from "./components/Navigation/NavComponent.jsx";
import "./index.css";

const Layout = ({ children }) => (
  <>
    <NavComponent />
    <main className="mt-16">
      {children}
    </main>
  </>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:username" element={<ProfilePage isEditing={false} />} />
            <Route path="/:username/edit" element={<ProfilePage isEditing={true} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
