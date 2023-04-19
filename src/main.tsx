import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "stream-chat-react/dist/css/v2/index.css";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { E2eeManger } from "./utils/e2ee";

function Main() {
	const [loading, setLoading] = useState(true);
	const queryClient = new QueryClient();

	useEffect(() => {
		(async () => {
			await E2eeManger.instance.generateKeyPair();
			console.log("Key pair generated");
			setLoading(false);
		})();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<AuthContextProvider>
					<App />
				</AuthContextProvider>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<Main />
	</React.StrictMode>
);
