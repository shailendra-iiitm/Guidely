// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import routes from "./routes";
import ProtectedRoute from "./components/ProtectedRoute";
import EnvironmentIndicator from "./components/EnvironmentIndicator";
import SupportWidget from "./components/SupportWidget";

const App = () => (
  <div className="mx-auto max-w-screen-3xl">
    <EnvironmentIndicator />
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
      <SupportWidget />
    </BrowserRouter>
  </div>
);

export default App;
