import { useState } from "react";
import { User } from "../types";

export default function SelectUser({
	onUserSelected,
}: {
	onUserSelected: (user: User) => void;
}) {
	const [user, setUser] = useState<User>({
		email: "",
		username: "",
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onUserSelected(user);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};

	return (
		<div className="select-username">
			<form onSubmit={handleSubmit}>
				<input
					type="email"
					value={user.email}
					name="email"
					onChange={handleChange}
					placeholder="Email"
				/>

				<input
					placeholder="Username"
					type="text"
					name="username"
					value={user.username}
					onChange={handleChange}
				/>

				<button disabled={!user.email || !user.username} type="submit">
					Submit
				</button>
			</form>
		</div>
	);
}
