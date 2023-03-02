import { Server as HttpServer } from "http";
import { Server, ServerOptions } from "socket.io";
import { ClientEvents, ServerEvents } from "./events";
import { Api } from "./generated/models";
import chatHandlers from "./handlers/chat";
import { ServiceImpl } from "./impl";

export function createApplication(
	httpServer: HttpServer,
	implementation: ServiceImpl,
	serverOptions: Partial<ServerOptions> = {}
): Server<ClientEvents, ServerEvents> {
	const io = new Server<ClientEvents, ServerEvents>(httpServer, serverOptions);

	const { getMessages, sendMessage } = chatHandlers(io, implementation);

	io.use((socket, next) => {
		const username = socket.handshake.auth.username;
		const email = socket.handshake.auth.email;

		if (!username || !email) {
			return next(new Error("invalid username or email"));
		}
		next();
	});

	io.on("connection", (socket) => {
		console.log("connected", socket.id);
		const users: Api.User[] = [];

		for (const [id, socket] of io.of("/").sockets) {
			users.push({
				id,
				username: socket.handshake.auth.username,
				email: socket.handshake.auth.email,
			});
		}

		socket.emit("connected:users", users);

		socket.broadcast.emit("user:joined", {
			id: socket.id,
			username: socket.handshake.auth.username,
			email: socket.handshake.auth.email,
		});

		socket.on("privateMessage:send", sendMessage);
		socket.on("privateMessage:get", getMessages);

		socket.on("disconnect", () => {
			socket.broadcast.emit("user:left", {
				id: socket.id,
				username: socket.handshake.auth.username,
				email: socket.handshake.auth.email,
			});
		});
	});

	return io;
}
