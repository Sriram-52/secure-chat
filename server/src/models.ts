export interface User {
	userId: string;
	username: string;
	connected: boolean;
	messages: Message[];
}

export interface Message {
	id: string;
	content: string;
	from: string;
	to: string;
}

export interface Session {
	id: string;
	userId: string;
	username: string;
	connected: boolean;
}
