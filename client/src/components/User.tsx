import { User } from "../types";
import styles from "./User.module.css";

export default function UserComponent({
	user,
	selected,
	onSelect,
}: {
	user: User;
	selected: boolean;
	onSelect: (user: User) => void;
}) {
	const handleClick = () => {
		onSelect(user);
	};

	return (
		<div className={styles.user} onClick={handleClick}>
			<div className={styles.description}>
				<div className={styles.name}>
					<span>{user.username}</span>
				</div>
			</div>
		</div>
	);
}
