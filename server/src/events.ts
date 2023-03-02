import { Api } from "./generated/models";
import * as t from "./generated/api/chat/types";

export interface ServerEvents {
	"privateMessage:received": (message: Api.Message) => void;
	"user:joined": (user: Api.User) => void;
	"user:left": (user: Api.User) => void;
	"connected:users": (users: Api.User[]) => void;
}

export interface ClientEvents {
	"privateMessage:send": (
		payload: Api.Message,
		callback: (res?: t.SendMessageResponse) => void
	) => void;

	"privateMessage:get": (userid: string, callback: (res?: t.GetMessagesResponse) => void) => void;
}
