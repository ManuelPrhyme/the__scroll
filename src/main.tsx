import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {Buffer} from 'buffer'

declare global {
    interface Window {
        Buffer : Buffer
    }
}

createRoot(document.getElementById("root")!).render(<App />);
