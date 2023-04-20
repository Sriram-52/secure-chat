import { Routes, Route, Navigate } from "react-router-dom";
import { unProtectedRoutes, protectedRoutes } from "./routes";
import { useAuth } from "./context/AuthContext";
import NotFoundPage from "./pages/NotFoundPage";
import { useEffect, useState } from "react";
import Navbar from "./layout/Navbar";

export default function App() {
	const { user, tokenListener } = useAuth();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		tokenListener(() => setLoading(false));
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!user) {
		return (
			<Routes>
				{unProtectedRoutes.map(({ path, Component }) => (
					<Route key={path} path={path} element={<Component />} />
				))}
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		);
	}

	return (
		<Navbar>
			<Routes>
				<Route path="*" element={<NotFoundPage />} />
				{protectedRoutes.map(({ path, Component }) => (
					<Route key={path} path={path} element={<Component />} />
				))}
				<Route path="/login" element={<Navigate to="/" replace />} />
			</Routes>
		</Navbar>
	);
}
