import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import {
  Link,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import "./index.css";

import Static from "./01_Static.tsx";
const Dynamic = lazy(() => import("./02_Dynamic.tsx"));

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
        <NavLink to='/dynamic'>Dynamic</NavLink>
        <NavLink to='/audio'>Audio</NavLink>
        <NavLink to='/terrain'>Terrain</NavLink>
        <NavLink to='/grass'>Grass</NavLink>
      </nav>

      <Routes>
        <Route path='/' element={<Static />} />
        <Route
          path='/dynamic'
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Dynamic />
            </Suspense>
          }
        />
        <Route path='/audio' element={<Static />} />
        <Route path='/terrain' element={<Static />} />
        <Route path='/grass' element={<Static />} />
      </Routes>
    </Router>
  </StrictMode>
);
