import YAML from "yamljs";
import express from "express";
import { ServiceImpl } from "./impl";
import swaggerUi from "swagger-ui-express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import { environment } from "./environment";
import serviceApi from "./generated";
import http from "http";
import morgan from "morgan";
import { createApplication } from "./app";

const swaggerDocument = YAML.load("openapi.yml");

const app = express();
const impl = new ServiceImpl();

const options: swaggerUi.SwaggerUiOptions = {
	swaggerOptions: {
		url: "/api-docs/swagger.json",
		displayRequestDuration: true,
	},
};

app.use(morgan("dev"));
app.use(
	session({
		resave: false,
		saveUninitialized: true,
		secret: environment.secret,
	})
);
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ origin: true }));

// passport config
passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user: any, done) => {
	done(null, user);
});

app.get("/api-docs/swagger.json", (_, res) => res.json(swaggerDocument));
app.use("/api-docs", swaggerUi.serveFiles(undefined, options), swaggerUi.setup(undefined, options));

serviceApi(app, impl);

const httpServer = http.createServer(app);

createApplication(httpServer, impl, {
	cors: {
		origin: "http://localhost:5173",
	},
});

httpServer.listen(environment.port, () => {
	console.log(`App running on http://localhost:${environment.port}`);
});
