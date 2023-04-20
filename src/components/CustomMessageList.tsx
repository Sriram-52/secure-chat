import { useEffect, useState } from "react";
import {
	MessageList,
	useChannelStateContext,
	StreamMessage,
} from "stream-chat-react";
import { E2eeManger } from "../utils/e2ee";
import { useAuth } from "../context/AuthContext";

export default function CustomMessageList() {
	const { channel, messages } = useChannelStateContext();
	const authContext = useAuth();
	const [decryptedMessages, setDecryptedMessages] = useState<
		StreamMessage[] | undefined
	>(messages);

	useEffect(() => {
		(async () => {
			if (!channel) {
				return;
			}

			const decryptedMessages = await Promise.all(
				messages?.map(async (message) =>
					E2eeManger.instance.decryptStreamMessage(
						message,
						authContext.user!.id
					)
				) ?? []
			);
			setDecryptedMessages(decryptedMessages);
		})();
	}, [messages]);

	return <MessageList messages={decryptedMessages} />;
}
