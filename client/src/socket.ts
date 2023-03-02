import { io } from "socket.io-client";

const socket = io("ws://127.0.0.1:8080", {
	transports: ["websocket"],
	autoConnect: true,
});

socket.onAny((event, ...args) => {
	console.log(event, args);
});

export default socket;
