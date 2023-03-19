import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "stream-chat-react/dist/css/v2/index.css";
import { E2eeManger } from "./utils/e2ee";

function Main() {
	const [loading, setLoading] = useState(true);

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

	const getQueryParams = () => {
		const params = new URLSearchParams(window.location.search);
		const userId = params.get("userId");
		return { userId };
	};

	const { userId } = getQueryParams();

	if (!userId) {
		return <div>Missing userId</div>;
	}

	return <App userId={userId} />;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<Main />
	</React.StrictMode>
);
