import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import "./index.css";

// Import your components
import AdminQuizManager from "./Components/AdminQuizManager.tsx";
import QuizApp from "./Components/QuizApp.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Router>
			<Routes>
				<Route path="/admin" element={<AdminQuizManager />} />
				<Route path="/" element={<QuizApp />} />
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</Router>
	</StrictMode>
);
