// Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./src/components/navbar";
import Footer from "./src/components/footer";
import "./src/index.css";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;