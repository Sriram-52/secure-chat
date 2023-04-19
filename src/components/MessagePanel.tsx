import { ChannelSort, Message } from "stream-chat";
import {
	Chat,
	Channel,
	ChannelHeader,
	ChannelList,
	LoadingIndicator,
	MessageInput,
	Thread,
	Window,
	MessageToSend,
} from "stream-chat-react";
import { E2eeManger } from "../utils/e2ee";
import { useClient } from "../hooks/useClient";
import { environment } from "../environment";
import CustomMessageList from "./CustomMessageList";

export default function MessagePanel({ userId }: { userId: string }) {
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

	const handleSubmit = async (
		message: MessageToSend,
		channelCid: string,
		messageData?: Partial<Message>
	) => {
		const TAG = "overrideSubmitHandler";
		const channels = await chatClient.queryChannels({
			cid: {
				$eq: channelCid,
			},
		});
		if (channels.length === 0) {
			console.error("Channel not found", TAG);
			return;
		}
		const channel = channels[0];

		const { members } = await channel.queryMembers({});

		const otherUser = members.find(
			(member) => member.user_id !== chatClient.userID
		);

		if (!otherUser) {
			console.error("Other user not found", TAG);
			return;
		}

		const otherUserPublicKey = otherUser.user?.publicKey as string;

		if (!otherUserPublicKey) {
			console.error("Other user public key not found", TAG);
			return;
		}

		const plainText = message.text ?? "";

		const parsedReceiversPublicKey = await E2eeManger.instance.importPublicKey(
			otherUserPublicKey
		);
		const receiverEncryptedText = await E2eeManger.instance.encryptMessage(
			plainText,
			parsedReceiversPublicKey
		);

		const parsedSendersPublicKey = await E2eeManger.instance.importPublicKey(
			E2eeManger.instance.getPublicKey()
		);
		const senderEncryptedText = await E2eeManger.instance.encryptMessage(
			plainText,
			parsedSendersPublicKey
		);

		const messageToSend: Message = {
			...messageData,
			text: receiverEncryptedText,
			extraFields: {
				senderEncryptedText,
			},
		};

		await channel.sendMessage(messageToSend);
		console.log("Message sent", TAG);
	};

	return (
		<Chat client={chatClient} theme="str-chat__theme-light">
			<ChannelList filters={filters} sort={sort} />
			<Channel>
				<Window>
					<ChannelHeader />
					<CustomMessageList />
					<MessageInput overrideSubmitHandler={handleSubmit} />
				</Window>
				<Thread />
			</Channel>
		</Chat>
	);
}
