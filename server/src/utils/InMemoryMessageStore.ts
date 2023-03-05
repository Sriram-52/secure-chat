import { Message } from "../models";

interface MessageStore {
	saveMessage(message: Message): void;
	findMessagesForUser(userId: string): Message[];
}

export class InMemoryMessageStore implements MessageStore {
	messages: Map<string, Message> = new Map();

	saveMessage(message: Message): void {
		this.messages.set(message.id, message);
	}

	findMessagesForUser(userId: string): Message[] {
		return Array.from(this.messages.values()).filter(
			(message) => message.from === userId || message.to === userId
		);
	}
}
