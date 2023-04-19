import { Routes, Route, Navigate } from "react-router-dom";
import { unProtectedRoutes, protectedRoutes } from "./routes";
import { useAuth } from "./context/AuthContext";
import NotFoundPage from "./pages/NotFoundPage";
import { useEffect } from "react";

export default function App() {
	const authContext = useAuth();

	const user = authContext?.user;

	useEffect(() => {
		authContext?.tokenListener();
	}, []);

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
		<Routes>
			<Route path="*" element={<NotFoundPage />} />
			{protectedRoutes.map(({ path, Component }) => (
				<Route key={path} path={path} element={<Component />} />
			))}
			<Route path="/login" element={<Navigate to="/" replace />} />
		</Routes>
	);
}
