import UserComponent from "./User";
import styles from "./Chat.module.css";
import { useEffect, useState } from "react";
import { Message, User } from "../types";
import socket from "../socket";

export default function Chat() {
	const [users, setUsers] = useState<User[]>([]);
	const [selectedUser, setSelectedUser] = useState<User>();

	useEffect(() => {
		const initReactiveProperties = (user: User) => {
			user.connected = true;
			user.messages = [];
			user.hasNewMessages = false;

			return user;
		};

		console.log("connecting");

		socket.on("connect", () => {
			console.log("connected");
			setUsers((users) => {
				return users.map((user) => {
					user.connected = true;
					return user;
				});
			});
		});

		socket.on("disconnect", () => {
			setUsers((users) => {
				return users.map((user) => {
					user.connected = false;
					return user;
				});
			});
		});

		socket.on("users", (users: User[]) => {
			setUsers(
				users.map(initReactiveProperties).sort((a, b) => {
					if (a.self) return -1;
					if (b.self) return 1;
					if (a.username < b.username) return -1;
					return a.username > b.username ? 1 : 0;
				})
			);
		});

		socket.on("user:joined", (user: User) => {
			setUsers((users) => {
				return [...users, initReactiveProperties(user)];
			});
		});

		socket.on("user:left", (user: User) => {
			setUsers((users) => {
				return users.map((u) => {
					if (u.id === user.id) {
						u.connected = false;
					}
					return u;
				});
			});
		});

		socket.on("privateMessage:received", (message: Message) => {
			setUsers((users) => {
				return users.map((u) => {
					if (u.id === message.receiver) {
						if (!u.messages) {
							u.messages = [];
						}
						u.messages.push(message);
						u.hasNewMessages = true;
					}
					return u;
				});
			});
		});

		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("users");
			socket.off("user:joined");
			socket.off("user:left");
			socket.off("privateMessage:received");
		};
	}, []);

	return (
		<div>
			<div className={styles.leftPanel}>
				{users.map((user) => (
					<UserComponent
						key={user.id}
						user={user}
						selected={selectedUser?.id === user.id}
						onSelect={() => setSelectedUser(user)}
					/>
				))}
			</div>
		</div>
	);
}
