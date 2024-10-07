import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

const App2 = lazy(() => import("./App2"));

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
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/demo2'>About</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path='/' element={<App />} />
        <Route
          path='/demo2'
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <App2 />
            </Suspense>
          }
        />
      </Routes>
    </Router>
  </StrictMode>
);
