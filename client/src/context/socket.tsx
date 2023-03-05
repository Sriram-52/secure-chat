import { io, Socket } from "socket.io-client";
import * as React from "react";
import { ClientEvents, ServerEvents } from "../events";
import { Message, User } from "../models";

const socket: Socket<ServerEvents, ClientEvents> = io("http://localhost:8080");
const SocketContext = React.createContext({
	users: [] as User[],
	messages: [] as Message[],
	socket,
});

socket.onAny((event, ...args) => {
	console.log(event, args);
});

export const useSocketContext = () => React.useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	const [users, setUsers] = React.useState<User[]>([]);
	const [messages, setMessages] = React.useState<Message[]>([]);

	React.useEffect(() => {
		const initReactiveProperties = (user: User) => {
			user.connected = true;
			user.messages = [];
			user.hasNewMessages = false;

			return user;
		};

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

		socket.on("user connected", (user: User) => {
			if (users.find((u) => u.username === user.username)) {
				setUsers((users) => {
					return users.map((u) => {
						if (u.username === user.username) {
							u.connected = true;
						}
						return u;
					});
				});
				return;
			}

			setUsers((users) => {
				return [...users, initReactiveProperties(user)];
			});
		});

		socket.on("user disconnected", (userId: string) => {
			setUsers((users) => {
				return users.map((u) => {
					if (u.userId === userId) {
						u.connected = false;
					}
					return u;
				});
			});
		});

		socket.on("private message", (message: Message) => {
			setMessages((messages) => [...messages, message]);
		});

		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("users");
			socket.off("user connected");
			socket.off("user disconnected");
			socket.off("private message");
		};
	}, []);

	return (
		<SocketContext.Provider
			value={{
				users,
				messages,
				socket,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};
