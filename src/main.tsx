import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Link, BrowserRouter as Router, useLocation } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

const NavLink = ({ to, children }: any) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={isActive ? "cur" : ""}>
      {children}
    </Link>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router basename='/r3f-instancing/'>
      <nav className='navbar'>
        <NavLink to='/'>Static</NavLink>
        <NavLink to='/video'>Video</NavLink>
        <NavLink to='/audio'>Audio</NavLink>
        <NavLink to='/terrain'>Terrain</NavLink>
        <NavLink to='/grass'>Grass</NavLink>
      </nav>

      <App />
    </Router>
  </StrictMode>
);
