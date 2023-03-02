export interface Message {
	id?: string;
	sender: string;
	receiver: string;
	message: string;
}

export interface User {
	id?: string;
	username: string;
	email: string;
	password?: string;
	connected?: boolean;
	hasNewMessages?: boolean;
	messages?: Message[];
	self?: boolean;
}
