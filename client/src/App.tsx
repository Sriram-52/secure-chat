import { useState } from "react";
import "./App.css";
import { User } from "./types";
import SelectUser from "./components/SelectUser";
import Chat from "./components/Chat";

function App() {
	const [user, setUser] = useState<User>();

	const handleUserSelected = (user: User) => {
		setUser(user);
	};

	return (
		<div>
			{user ? <Chat /> : <SelectUser onUserSelected={handleUserSelected} />}
		</div>
	);
}

export default App;
