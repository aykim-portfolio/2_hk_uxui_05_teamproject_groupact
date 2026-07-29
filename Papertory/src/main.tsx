
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

declare const __PAPERTORY_BUILD_ID__: string;

createRoot(document.getElementById("root")!).render(<App />);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(
        `${import.meta.env.BASE_URL}sw.js?v=${encodeURIComponent(__PAPERTORY_BUILD_ID__)}`,
        {
          scope: import.meta.env.BASE_URL,
        },
      )
      .catch((error) => {
        console.warn("Papertory service worker registration failed:", error);
      });
  });
}
