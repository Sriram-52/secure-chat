import { useState } from "react";
import { User } from "../models";

export default function SelectUser({
	onUserSelected,
}: {
	onUserSelected: (user: Partial<User>) => void;
}) {
	const [user, setUser] = useState<Partial<User>>({
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
					placeholder="Username"
					type="text"
					name="username"
					value={user.username}
					onChange={handleChange}
				/>

				<button disabled={!user.username} type="submit">
					Submit
				</button>
			</form>
		</div>
	);
}
