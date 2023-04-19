import { useEffect, useState } from "react";
import { E2eeManger } from "../utils/e2ee";
import MessagePanel from "../components/MessagePanel";
import { useAuth } from "../context/AuthContext";

export default function ChatPage() {
	const [loading, setLoading] = useState(true);
	const authContext = useAuth();

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

	const userId = authContext?.user?.id;

	if (!userId) {
		return <div>Something went wrong</div>;
	}

	return <MessagePanel userId={userId} />;
}
