import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { PasswordProvider } from "@/context/PasswordContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PasswordProvider>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </PasswordProvider>
  </StrictMode>
);
