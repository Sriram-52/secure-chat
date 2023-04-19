import { AxiosInstance } from "axios";

export class InterceptorService {
	public constructor(private _axiosInstance: AxiosInstance) {}

	public addRequestInterceptor(): InterceptorService {
		this._axiosInstance.interceptors.request.use(
			(config) => {
				if (["post", "put", "delete"].includes(config.method || "")) {
					// LoaderService.instance.showLoader();
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);
		return this;
	}

	public addResponseInterceptor(): InterceptorService {
		this._axiosInstance.interceptors.response.use(
			(response) => {
				if (["post", "put", "delete"].includes(response.config.method || "")) {
					if (response.data && response.data.message) {
						// AlertService.instance.successMessage(response.data.message);
					} else {
						// AlertService.instance.successMessage("Saved successfully");
					}
				}
				// LoaderService.instance.hideLoader();
				return response;
			},
			(error) => {
				if (error.response) {
					if (error.response.data && error.response.data.message) {
						// AlertService.instance.errorMessage(error.response.data.message);
					} else {
						// AlertService.instance.errorMessage("Something went wrong");
					}
				}
				// LoaderService.instance.hideLoader();
				return Promise.reject(error);
			}
		);
		return this;
	}
}
