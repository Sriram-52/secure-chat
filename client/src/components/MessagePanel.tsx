import { User } from "../types";
import styles from "./MessagePanel.module.css";

export default function MessagePanel({ user }: { user: User }) {
	return (
		<div>
			<div className={styles.header}>{user.username}</div>

			<ul className={styles.messages}>
				{user.messages?.map((message) => (
					<li key={message.id} className={styles.sender}>
						<div className={styles.messageContent}>{message.message}</div>
					</li>
				))}
			</ul>

			<form className={styles.form}>
				<input
					className={styles.input}
					type="text"
					placeholder="Type a message..."
				/>

				<button className={styles.button} type="submit">
					Send
				</button>
			</form>
		</div>
	);
}
