import { AuthenticationApi } from "../generated/api/authentication/types";
import { ChatApi } from "../generated/api/chat/types";
import { ApiImplementation } from "../generated/types";
import authentication from "./authentication";
import chat from "./chat";

export class ServiceImpl implements ApiImplementation {
	authentication: AuthenticationApi = authentication;
	chat: ChatApi = chat;
}
