import { useEffect, useState } from "react";
import { LogLevel, StreamChat, User } from "stream-chat";
import { userControllerGetToken } from "../api/services/base/users";

export const useClient = ({
	apiKey,
	userData,
}: {
	apiKey: string;
	userData: User;
}) => {
	const [chatClient, setChatClient] = useState<StreamChat | null>(null);

	useEffect(() => {
		const client = new StreamChat(apiKey, {
			logger: (level: LogLevel, msg, extra) => {
				if (level === "error") {
					console.error(msg, extra);
				}
			},
		});
		// prevents application from setting stale client (user changed, for example)
		let didUserConnectInterrupt = false;

		let connectionPromise: Promise<any> = Promise.resolve();

		(async () => {
			const token = await userControllerGetToken(userData.id);
			connectionPromise = client.connectUser(userData, token);
			await connectionPromise;
			if (!didUserConnectInterrupt) {
				setChatClient(client);
			}
		})();

		return () => {
			didUserConnectInterrupt = true;
			setChatClient(null);
			// wait for connection to finish before initiating closing sequence
			connectionPromise
				.then(() => client.disconnectUser())
				.then(() => {
					console.log("connection closed");
				});
		};
	}, [apiKey, userData.id]);

	return chatClient;
};
