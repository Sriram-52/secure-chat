import { Server } from "socket.io";
import { ClientEvents, ServerEvents } from "../events";
import { Api } from "../generated/models";
import { ServiceImpl } from "../impl";
import * as t from "../generated/api/chat/types";

export default function chatHandlers(
	io: Server<ClientEvents, ServerEvents>,
	implementation: ServiceImpl
) {
	const { sendMessage, getMessages } = implementation.chat;

	return {
		async sendMessage(payload: Api.Message) {
			console.log("sendMessage", payload);
		},

		async getMessages(userid: string, callback: (res?: t.GetMessagesResponse) => void) {
			const res = await getMessages(userid);
			callback(res);
		},
	};
}
