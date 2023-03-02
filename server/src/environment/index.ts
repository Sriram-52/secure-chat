import dotenv from "dotenv";

dotenv.config();

export const environment = {
	production: process.env.NODE_ENV === "production",
	port: process.env.PORT || 8080,
	secret: process.env.SECRET || "SECRET",
};
