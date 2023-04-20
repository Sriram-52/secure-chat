import React, { createContext, useContext, useMemo } from "react";
import { StreamChat } from "stream-chat";
import { useAuth } from "./AuthContext";
import { useClient } from "../hooks/useClient";
import { environment } from "../environment";
import { E2eeManger } from "../utils/e2ee";
import { LoadingIndicator } from "stream-chat-react";

type ChatContextType = {
	chatClient: StreamChat | null;
};

export const ChatContext = createContext<ChatContextType | null>(null);

export const useChatContext = () => {
	const context = useContext(ChatContext);
	if (!context) {
		throw new Error("ChatContext not found");
	}
	return context;
};

function ChatProvider({ children }: { children: React.ReactNode }) {
	const { user } = useAuth();

	const chatClient = useClient({
		apiKey: environment.apiKey,
		userData: {
			id: user?.id ?? "",
			publicKey: E2eeManger.instance.getPublicKey(),
		},
	});

	const value = useMemo((): ChatContextType => {
		return {
			chatClient,
		};
	}, [chatClient]);

	return (
		<ChatContext.Provider value={value}>
			{chatClient ? children : <LoadingIndicator />}
		</ChatContext.Provider>
	);
}

export default ChatProvider;
