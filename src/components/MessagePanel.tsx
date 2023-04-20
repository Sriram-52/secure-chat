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
import CustomMessageList from "./CustomMessageList";
import { useChatContext } from "../context/ChatContext";
import { Box } from "@mui/material";
import NewChat from "./NewChat";
import CustomChannelPreview from "./CustomChannelPreview";

export default function MessagePanel({ userId }: { userId: string }) {
	const { chatClient } = useChatContext();

	if (!chatClient) {
		return <LoadingIndicator size={20} />;
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
			<Box
				sx={{
					display: "flex",
					height: {
						xs: `calc(100vh - 48px)`,
						sm: `calc(100vh - 64px)`,
						md: `calc(100vh - 80px)`,
					},
				}}
			>
				<ChannelList
					filters={filters}
					sort={sort}
					showChannelSearch
					Preview={CustomChannelPreview}
				/>
				<Channel>
					<Window>
						<ChannelHeader />
						<CustomMessageList />
						<MessageInput overrideSubmitHandler={handleSubmit} />
					</Window>
					<Thread />
				</Channel>
			</Box>
			<Box
				sx={{
					position: "absolute",
					bottom: 0,
					left: "18%",
					p: 2,
				}}
			>
				<NewChat />
			</Box>
		</Chat>
	);
}
