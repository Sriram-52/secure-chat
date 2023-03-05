import UserComponent from "./User";
import styles from "./Chat.module.css";
import { useState } from "react";
import { User } from "../models";
import { useSocketContext } from "../context/socket";
import MessagePanel from "./MessagePanel";

export default function Chat() {
	const [selectedUser, setSelectedUser] = useState<User>();
	const { users } = useSocketContext();

	const onUserSelected = (user: User) => {
		setSelectedUser(user);
		user.hasNewMessages = false;
	};

	return (
		<div>
			<div className={styles.leftPanel}>
				{users.map((user) => (
					<UserComponent
						key={user.userId}
						user={user}
						selected={selectedUser?.userId === user.userId}
						onSelect={onUserSelected}
					/>
				))}
			</div>
			<div className={styles.rightPanel}>
				{selectedUser && <MessagePanel user={selectedUser} />}
			</div>
		</div>
	);
}
