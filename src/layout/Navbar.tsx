import { useEffect, useState } from "react";
import ChatProvider from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { E2eeManger } from "../utils/e2ee";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";

export default function Navbar({ children }: { children: React.ReactNode }) {
	const [loading, setLoading] = useState(true);
	const { user } = useAuth();

	useEffect(() => {
		(async () => {
			await E2eeManger.instance.generateKeyPair();
			console.log("Key pair generated");
			setLoading(false);
		})();
	}, []);

	return (
		<>
			<AppBar position="sticky">
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Chat App
					</Typography>
					<Typography variant="h6" component="div">
						{user?.name}
					</Typography>
				</Toolbar>
			</AppBar>
			<Box component="main" px={2} mt={1}>
				{loading ? (
					<Typography variant="h6" component="div" sx={{ textAlign: "center" }}>
						Generating key pair...
					</Typography>
				) : (
					<ChatProvider>{children}</ChatProvider>
				)}
			</Box>
		</>
	);
}
