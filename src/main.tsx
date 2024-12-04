import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { PlayerProvider } from "./utils/PlayerContext";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<PlayerProvider>
			<App />
		</PlayerProvider>
	</StrictMode>,
);
