import { useEffect, useState } from "react";
import { ChannelSort, Message as MessageType } from "stream-chat";
import {
	Chat,
	Channel,
	ChannelHeader,
	ChannelList,
	LoadingIndicator,
	MessageInput,
	MessageList,
	Thread,
	Window,
} from "stream-chat-react";
import { environment } from "./environment";
import { useClient } from "./hooks/useClient";
import { E2eeManger } from "./utils/e2ee";

const MessageComponent = ({ message }: { message: string | undefined }) => {
	const [decryptedMessage, setDecryptedMessage] = useState<string | undefined>(
		undefined
	);

	useEffect(() => {
		const decryptMessage = async () => {
			const decryptedMessage = await E2eeManger.instance.decryptMessage(
				message ?? ""
			);
			setDecryptedMessage(decryptedMessage);
		};
		decryptMessage();
	}, [message]);

	if (decryptedMessage) {
		return <div>{decryptedMessage}</div>;
	}

	return <div>{message}</div>;
};

const App = ({ userId }: { userId: string }) => {
	const chatClient = useClient({
		apiKey: environment.apiKey,
		userData: {
			id: userId,
			publicKey: E2eeManger.instance.getPublicKey(),
		},
	});

	if (!chatClient) {
		return <LoadingIndicator />;
	}

	const filters = { type: "messaging", members: { $in: [userId] } };
	const sort: ChannelSort = { last_message_at: -1 };

	return (
		<Chat client={chatClient} theme="str-chat__theme-light">
			<ChannelList filters={filters} sort={sort} />
			<Channel>
				<Window>
					<ChannelHeader />
					<MessageList
						renderText={(props) => <MessageComponent message={props} />}
					/>
					<MessageInput
						overrideSubmitHandler={async (message, channelCid, messageData) => {
							const channels = await chatClient.queryChannels({
								cid: {
									$eq: channelCid,
								},
							});
							if (channels.length === 0) {
								console.error("Channel not found");
								return;
							}
							const channel = channels[0];

							const { members } = await channel.queryMembers({});

							const otherUser = members.find(
								(member) => member.user_id !== chatClient.userID
							);

							console.log({ otherUser });

							if (!otherUser) {
								console.error("Other user not found");
								return;
							}

							const otherUserPublicKey = otherUser.user?.publicKey as string;

							if (!otherUserPublicKey) {
								console.error("Other user public key not found");
								return;
							}

							const parsedPublicKey = await E2eeManger.instance.importPublicKey(
								otherUserPublicKey
							);

							message.text = await E2eeManger.instance.encryptMessage(
								message.text ?? "",
								parsedPublicKey
							);
							const messageToSend: MessageType = {
								...messageData,
								text: message.text,
							};

							await channel.sendMessage(messageToSend);
							console.log("Message sent");
						}}
					/>
				</Window>
				<Thread />
			</Channel>
		</Chat>
	);
};

export default App;
