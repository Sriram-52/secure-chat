import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export type Route = {
	path: string;
	Component: React.ComponentType;
};

export const unProtectedRoutes: Route[] = [
	{
		path: "/login",
		Component: LoginPage,
	},
	{
		path: "/register",
		Component: RegisterPage,
	},
];

export const protectedRoutes: Route[] = [
	{
		path: "/",
		Component: ChatPage,
	},
];
