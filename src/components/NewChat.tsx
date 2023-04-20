import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import {
	useUserControllerCreateChannel,
	useUserControllerGetAll,
} from "../api/services/base/users";
import { useAuth } from "../context/AuthContext";

export default function NewChat() {
	const { user: loggedInUser } = useAuth();
	const [open, setOpen] = useState(false);
	const [userId, setUserId] = useState("");

	const { data } = useUserControllerGetAll({
		query: {
			enabled: open,
		},
	});

	const useCreateChannel = useUserControllerCreateChannel({
		mutation: {
			onSuccess: () => {
				setOpen(false);
			},
		},
	});

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		useCreateChannel.mutate({
			id: loggedInUser?.id || "",
			data: {
				members: [userId],
			},
		});
	};

	return (
		<>
			<Fab color="primary" onClick={handleOpen}>
				<AddIcon />
			</Fab>
			<Dialog maxWidth="xs" fullWidth open={open} onClose={handleClose}>
				<form onSubmit={handleSubmit}>
					<DialogTitle>New Chat</DialogTitle>
					<DialogContent>
						<Autocomplete
							options={data || []}
							filterSelectedOptions
							getOptionLabel={(option) => option?.name}
							renderInput={(params) => (
								<TextField
									{...params}
									label="User"
									variant="standard"
									required
								/>
							)}
							onChange={(e, value) => {
								setUserId(value?.id || "");
							}}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose}>Cancel</Button>
						<Button type="submit">Create</Button>
					</DialogActions>
				</form>
			</Dialog>
		</>
	);
}
