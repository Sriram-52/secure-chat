import * as React from "react";
import { useSocketContext } from "../context/socket";
import { User } from "../models";
import styles from "./MessagePanel.module.css";

export default function MessagePanel({ user }: { user: User }) {
	const [message, setMessage] = React.useState("");
	const { socket, messages } = useSocketContext();

	const onMessage = (content: string) => {
		socket.emit("private message", {
			to: user.userId,
			content,
		});
	};

	const myMessages = messages?.filter(
		(m) => m.from === user.userId || m.to === user.userId
	);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onMessage(message);
		setMessage("");
	};

	return (
		<div>
			<div className={styles.header}>{user.username}</div>

			<ul className={styles.messages}>
				{myMessages?.map((message) => (
					<li key={message.id} className={styles.sender}>
						<div className={styles.messageContent}>{message.content}</div>
					</li>
				))}
			</ul>

			<form onSubmit={handleSubmit} className={styles.form}>
				<input
					className={styles.input}
					type="text"
					placeholder="Type a message..."
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>

				<button className={styles.button} type="submit">
					Send
				</button>
			</form>
		</div>
	);
}
