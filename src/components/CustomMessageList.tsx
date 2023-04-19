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
				messages?.map(async (message) => {
					try {
						let cipherText = message.text;
						if (authContext?.user?.id === message.user?.id) {
							const extraFields = (message.extraFields ?? {}) as {
								senderEncryptedText?: string;
							};

							cipherText = extraFields?.senderEncryptedText ?? "No message";
						}

						const decryptedMessage = await E2eeManger.instance.decryptMessage(
							cipherText ?? ""
						);

						return {
							...message,
							text: decryptedMessage,
						};
					} catch (error) {
						return {
							...message,
							text: "Error decrypting message" + error,
						};
					}
				}) ?? []
			);
			setDecryptedMessages(decryptedMessages);
		})();
	}, [messages]);

	return <MessageList messages={decryptedMessages} />;
}
