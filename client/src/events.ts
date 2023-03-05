import { Session, User, Message } from "./models";

export interface ServerEvents {
	session: (session: Session) => void;
	users: (users: User[]) => void;
	"user connected": (user: User) => void;
	"private message": (message: Message) => void;
	"user disconnected": (userId: string) => void;
}

export interface ClientEvents {
	"private message": ({ content, to }: { content: string; to: string }) => void;
}

export interface InterServerEvents {
	ping: () => void;
}

export interface SocketData {
	session: Session;
}
