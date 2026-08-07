import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./screens/App/App";

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
