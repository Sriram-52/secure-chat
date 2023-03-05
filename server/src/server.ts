import * as http from "http";
import * as crypto from "crypto";
import { Server } from "socket.io";
import { InMemoryMessageStore } from "./utils/InMemoryMessageStore";
import { InMemorySessionStore } from "./utils/InMemorySessionStore";
import { Message, User } from "./models";
import { ClientEvents, InterServerEvents, ServerEvents, SocketData } from "./events";

const messageStore = new InMemoryMessageStore();
const sessionStore = new InMemorySessionStore();

const server = http.createServer();
const io = new Server<ClientEvents, ServerEvents, InterServerEvents, SocketData>(server, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
	},
});

const randomId = () => crypto.randomBytes(8).toString("hex");

io.use((socket, next) => {
	const sessionId = socket.handshake.auth.sessionId;
	if (sessionId) {
		const session = sessionStore.findSession(sessionId);
		if (session) {
			socket.data.session = session;
			return next();
		}
	}

	const username = socket.handshake.auth.username;

	if (!username) {
		return next(new Error("invalid username"));
	}

	socket.data.session = {
		id: randomId(),
		userId: randomId(),
		username,
		connected: true,
	};
	next();
});

io.on("connection", (socket) => {
	if (!socket.data.session) {
		return;
	}
	// Save the session
	sessionStore.saveSession(socket.data.session);

	// Send the session back to the client
	socket.emit("session", socket.data.session);

	// join the user's room
	socket.join(socket.data.session.userId);

	// Send the list of online users
	const users: User[] = [];
	const messagesPerUser = new Map<string, Message[]>();
	messageStore.findMessagesForUser(socket.data.session.userId).forEach((message) => {
		const { from, to } = message;
		const otherUserId = from === socket.data.session?.userId ? to : from;
		if (!messagesPerUser.has(otherUserId)) {
			messagesPerUser.set(otherUserId, [message]);
		} else {
			messagesPerUser.get(otherUserId)?.push(message);
		}
	});

	sessionStore.findAllSessions().forEach((session) => {
		if (session.userId !== socket.data.session?.userId) {
			users.push({
				userId: session.userId,
				username: session.username,
				connected: session.connected,
				messages: messagesPerUser.get(session.userId) || [],
			});
		}
	});

	socket.emit("users", users);

	// notify existing users
	socket.broadcast.emit("user connected", {
		userId: socket.data.session.userId,
		username: socket.data.session.username,
		connected: true,
		messages: [],
	});

	// forward the private message to the right recipient

	socket.on("private message", ({ content, to }) => {
		if (!socket.data.session?.userId) {
			return;
		}

		const message: Message = {
			id: randomId(),
			content,
			from: socket.data.session.userId,
			to,
		};
		messageStore.saveMessage(message);
		socket.to(to).to(socket.data.session.userId).emit("private message", message);
	});

	// notify users upon disconnection
	socket.on("disconnect", async () => {
		if (!socket.data.session?.userId) {
			return;
		}

		const matchingSocketIds = await io.in(socket.data.session.userId).allSockets();
		const isDisconnected = matchingSocketIds.size === 0;
		if (isDisconnected) {
			// notify other users
			socket.broadcast.emit("user disconnected", socket.data.session.userId);
			// update the session information in the store
			sessionStore.saveSession({
				...socket.data.session,
				connected: false,
			});

			// remove the user's room
			socket.leave(socket.data.session.userId);
		}
	});
});

const PORT: number = Number(process.env.PORT) || 8080;

server.listen(PORT, () => {
	console.log(`Server listening at http://localhost:${PORT}`);
});
