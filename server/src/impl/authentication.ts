import * as t from "../generated/api/authentication/types";
import { Api } from "../generated/models";

async function loginUser(request: Api.User): Promise<t.LoginUserResponse> {
	throw "Unimplemented";
}

async function logoutUser(request: Api.User): Promise<t.LogoutUserResponse> {
	throw "Unimplemented";
}

async function registerUser(request: Api.User): Promise<t.RegisterUserResponse> {
	throw "Unimplemented";
}

const api: t.AuthenticationApi = {
	loginUser,
	logoutUser,
	registerUser,
};

export default api;
