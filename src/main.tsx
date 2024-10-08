import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./index.css";

import Static from "./01_Static.tsx";
const Dynamic = lazy(() => import("./02_Dynamic.tsx"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router basename='/r3f-instancing/'>
      <nav
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <ul>
          <li>
            <Link to='/'>Static</Link>
          </li>
          <li>
            <Link to='/dynamic'>Dynamic</Link>
          </li>
        </ul>
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
      </Routes>
    </Router>
  </StrictMode>
);
