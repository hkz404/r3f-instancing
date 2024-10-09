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
      {/* <Routes>
        <Route path='/' element={<Static />} />
        <Route
          path='/video'
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Video />
            </Suspense>
          }
        />
        <Route
          path='/audio'
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Audio />
            </Suspense>
          }
        />
        <Route path='/terrain' element={<Static />} />
        <Route path='/grass' element={<Static />} />
      </Routes> */}
    </Router>
  </StrictMode>
);
