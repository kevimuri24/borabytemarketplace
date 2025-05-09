import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add font awesome support
const fontAwesomeScript = document.createElement("link");
fontAwesomeScript.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";
fontAwesomeScript.rel = "stylesheet";
document.head.appendChild(fontAwesomeScript);

// Add Inter font from Google Fonts
const interFont = document.createElement("link");
interFont.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
interFont.rel = "stylesheet";
document.head.appendChild(interFont);

createRoot(document.getElementById("root")!).render(<App />);
