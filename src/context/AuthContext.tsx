import { createContext, useContext, useMemo, useState } from "react";
import { auth } from "../utils/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { E2eeManger } from "../utils/e2ee";

export type User = {
	id: string;
	name: string;
	email: string;
};

type AuthContextType = {
	user: User | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	tokenListener: (cb: () => void) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("AuthContext not found");
	}
	return context;
};

function AuthContextProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);

	const login = async (email: string, password: string) => {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		const { user } = userCredential;
		setUser({
			id: user.uid,
			name: user.displayName || "",
			email: user.email || email,
		});
	};

	const logout = async () => {
		await signOut(auth);
		E2eeManger.instance.deleteKeyPair();
		setUser(null);
	};

	const tokenListener = (cb: () => void) => {
		auth.onIdTokenChanged((user) => {
			if (user) {
				setUser({
					id: user.uid,
					name: user.displayName || "",
					email: user.email || "",
				});
			} else {
				setUser(null);
			}
			cb();
		});
	};

	const authContextValue = useMemo((): AuthContextType => {
		return {
			user,
			login,
			logout,
			tokenListener,
		};
	}, [user]);

	return (
		<AuthContext.Provider value={authContextValue}>
			{children}
		</AuthContext.Provider>
	);
}

export default AuthContextProvider;
