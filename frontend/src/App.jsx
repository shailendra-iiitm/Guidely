// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import routes from "./routes";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => (
  <div className="mx-auto max-w-screen-3xl">
    <Toaster position="top-center" />
    <BrowserRouter>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              route.isProtected ? (
                <ProtectedRoute>{route.element}</ProtectedRoute>
              ) : (
                route.element
              )
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
