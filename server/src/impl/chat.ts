import * as t from "../generated/api/chat/types";
import { Api } from "../generated/models";

async function sendMessage(request: Api.Message): Promise<t.SendMessageResponse> {
	throw "Unimplemented";
}

async function getMessages(userid: string): Promise<t.GetMessagesResponse> {
	throw "Unimplemented";
}

const api: t.ChatApi = {
	sendMessage,
	getMessages,
};

export default api;
