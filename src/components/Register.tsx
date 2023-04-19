import { useState } from "react";
import { Button, Container, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUserControllerCreate } from "../api/services/base/users";
import { E2eeManger } from "../utils/e2ee";

export default function Register() {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		name: "",
	});

	const [loading, setLoading] = useState(false);

	const [errors, setErrors] = useState({
		email: "",
		password: "",
		name: "",
	});

	const useRegister = useUserControllerCreate({
		mutation: {
			onSuccess: () => {
				setLoading(false);

				setFormData({
					email: "",
					password: "",
					confirmPassword: "",
					name: "",
				});

				setErrors({
					email: "",
					password: "",
					name: "",
				});

				navigate("/login");
			},
		},
	});

	const validate = () => {
		const { email, password, confirmPassword, name } = formData;
		const errors = {
			email: "",
			password: "",
			name: "",
		};

		if (email.trim().length === 0) {
			errors.email = "Email is required";
		}

		if (password.trim().length === 0) {
			errors.password = "Password is required";
		}

		if (confirmPassword.trim().length === 0) {
			errors.password = "Confirm password is required";
		}

		if (password !== confirmPassword) {
			errors.password = "Passwords do not match";
		}

		if (password.trim().length < 6) {
			errors.password = "Password must be at least 6 characters";
		}

		if (name.trim().length === 0) {
			errors.name = "Name is required";
		}

		return errors;
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const errors = validate();
		setErrors(errors);

		if (Object.values(errors).some((error) => error.length > 0)) {
			return;
		}

		setLoading(true);
		useRegister.mutate({
			data: {
				email: formData.email,
				password: formData.password,
				name: formData.name,
				publicKey: E2eeManger.instance.getPublicKey(),
			},
		});
	};

	return (
		<Container maxWidth="sm">
			<form onSubmit={handleSubmit}>
				<Typography variant="h4" component="h1" gutterBottom>
					Register
				</Typography>
				<TextField
					label="Email"
					type="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					error={!!errors.email}
					helperText={errors.email}
					fullWidth
					margin="normal"
					required
				/>
				<TextField
					label="Password"
					type="password"
					name="password"
					value={formData.password}
					onChange={handleChange}
					error={!!errors.password}
					helperText={errors.password}
					fullWidth
					margin="normal"
					required
				/>
				<TextField
					label="Confirm Password"
					type="password"
					name="confirmPassword"
					value={formData.confirmPassword}
					onChange={handleChange}
					error={!!errors.password}
					helperText={errors.password}
					fullWidth
					margin="normal"
					required
				/>
				<TextField
					label="Name"
					type="text"
					name="name"
					value={formData.name}
					onChange={handleChange}
					error={!!errors.name}
					helperText={errors.name}
					fullWidth
					margin="normal"
					required
				/>
				<Button
					type="submit"
					variant="contained"
					color="primary"
					disabled={loading}
				>
					{loading ? "Loading..." : "Register"}
				</Button>
			</form>
		</Container>
	);
}
