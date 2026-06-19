import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app/App.jsx";
import { initializeThemePreference } from "./services/settings.service.js";
import "./styles/global.css";
import "./styles/theme.css";

initializeThemePreference();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
