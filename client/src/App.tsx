import { useEffect, useState } from "react";
import { ChannelSort, Message } from "stream-chat";
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

import { useClient } from "./hooks/useClient";
import { E2eeManger } from "./utils/e2ee";

const filters = { type: "messaging", members: { $in: ["Henry"] } };
const sort: ChannelSort = { last_message_at: -1 };

const App = () => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			await E2eeManger.instance.generateKeyPair();
			console.log("Key pair generated");
			setLoading(false);
		})();
	}, []);

	const chatClient = useClient({
		apiKey: "rvpcyqs2cnb3",
		userData: {
			id: "Henry",
		},
	});

	if (!chatClient || loading) {
		return <LoadingIndicator />;
	}

	return (
		<Chat client={chatClient} theme="str-chat__theme-light">
			<ChannelList filters={filters} sort={sort} />
			<Channel>
				<Window>
					<ChannelHeader />
					<MessageList />
					<MessageInput
						overrideSubmitHandler={async (message, channelCid, messageData) => {
							message.text = "Hello, world!";
							const messageToSend: Message = {
								...messageData,
								text: message.text,
							};
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

							const otherUser = members.filter(
								(member) => member.user_id !== chatClient.userID
							);

							console.log({ otherUser });

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
