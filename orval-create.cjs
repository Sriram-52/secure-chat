const fs = require("fs");

const commonOutputOptions = {
	mode: "tags",
	client: "react-query",
	mock: false,
};

const commonInputOptions = {};

const commonHooks = {
	afterAllFilesWrite: "prettier --write",
};

const BASE_URL = "http://localhost:8080";

const instanceTemplate = `import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { environment } from "../../environment";
import { InterceptorService } from "../../utils/InterceptorService";

export const AXIOS_INSTANCE = Axios.create({ baseURL: BASE_URL });
const interceptorService = new InterceptorService(AXIOS_INSTANCE);
interceptorService.addRequestInterceptor().addResponseInterceptor();

export const CUSTOM_INSTANCE = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({ ...config, cancelToken: source.token }).then(
    ({ data }) => data,
  );

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled by React Query');
  };

  return promise;
};

export default CUSTOM_INSTANCE;

export interface ErrorType<Error> extends AxiosError<Error> {}
`;

const services = [{ name: "base", baseUrl: BASE_URL }];

// Create .env
fs.writeFileSync(
	"./.env",
	`VITE_API_URL=${BASE_URL}
VITE_API_KEY=sfxgknjtwe9a`
);

// Create Instances folder
fs.mkdirSync("./src/api/instances", { recursive: true });
services.forEach((service) => {
	let newTemplate = instanceTemplate.replace(
		/BASE_URL/g,
		"environment." + service.name.toUpperCase() + "_API"
	);
	newTemplate = newTemplate.replace(
		/CUSTOM_INSTANCE/g,
		`${service.name}Instance`
	);
	fs.writeFileSync(
		`./src/api/instances/${service.name}Instance.ts`,
		newTemplate
	);
});

const oravalInputs = services.map((service) => {
	return {
		[service.name]: {
			output: {
				...commonOutputOptions,
				target: `src/api/services/${service.name}/index.ts`,
				schemas: `src/api/services/${service.name}/models`,
				override: {
					mutator: {
						path: `src/api/instances/${service.name}Instance.ts`,
						name: `${service.name}Instance`,
					},
				},
			},
			input: {
				...commonInputOptions,
				target: `${service.baseUrl}/docs-json`,
			},
			hooks: {
				...commonHooks,
			},
		},
	};
});

const oravalConfig = oravalInputs.reduce((acc, input) => {
	return { ...acc, ...input };
}, {});

fs.writeFileSync(
	"./orval.config.cjs",
	`module.exports = ${JSON.stringify(oravalConfig, null, 2)}`
);
