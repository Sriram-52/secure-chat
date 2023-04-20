import MessagePanel from "../components/MessagePanel";
import { useAuth } from "../context/AuthContext";

export default function ChatPage() {
	const { user } = useAuth();

	return <MessagePanel userId={user!.id} />;
}
