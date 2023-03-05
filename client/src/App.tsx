import * as React from "react";
import "./App.css";
import SelectUser from "./components/SelectUser";
import Chat from "./components/Chat";
import { User } from "./models";
import { useSocketContext } from "./context/socket";

function App() {
	const [userNameSelected, setUserNameSelected] = React.useState(false);

	const { socket } = useSocketContext();

	React.useEffect(() => {
		const sessionId = localStorage.getItem("sessionId");
		if (sessionId) {
			setUserNameSelected(true);
			socket.auth = { sessionId };
			socket.connect();
		}

		socket.on("session", (session) => {
			socket.auth = { sessionId: session.id };

			localStorage.setItem("sessionId", session.id);

			setUserNameSelected(true);
		});

		socket.on("connect_error", (err) => {
			if (err.message === "invalid username") {
				alert("Username is already taken");
				setUserNameSelected(false);
			}
		});

		return () => {
			socket.disconnect();
			socket.off("session");
			socket.off("connect_error");
		};
	}, []);

	const handleUserSelected = (user: Partial<User>) => {
		setUserNameSelected(true);
		socket.auth = { username: user.username };
		socket.connect();
	};

	return (
		<div>
			{userNameSelected ? (
				<Chat />
			) : (
				<SelectUser onUserSelected={handleUserSelected} />
			)}
		</div>
	);
}

export default App;
