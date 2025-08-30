import { useGlobalStore } from "@/store/global.js";
import { RESPONSE_TYPES, validateResponse } from "./responseTypes";

const HTTP_STATUS_REQUEST_TIMEOUT = 408;
const HTTP_STATUS_TOO_MANY_REQUESTS = 429;
const HTTP_STATUS_BAD_GATEWAY = 502;
const HTTP_STATUS_SERVICE_UNAVAILABLE = 503;
const HTTP_STATUS_GATEWAY_TIMEOUT = 504;

const RETRYABLE_STATUS_CODES = [
    HTTP_STATUS_REQUEST_TIMEOUT,
    HTTP_STATUS_TOO_MANY_REQUESTS,
    HTTP_STATUS_BAD_GATEWAY,
    HTTP_STATUS_SERVICE_UNAVAILABLE,
    HTTP_STATUS_GATEWAY_TIMEOUT
];
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000;

export class HttpService {
    constructor(serviceName) {
        this.serviceName = serviceName;
    }

    get globalStore() {
        return useGlobalStore();
    }

    handleError(error, customMessage) {
        const backendMessage = error?.response?.data?.message;
        const validationErrors = error?.response?.data?.validationErrors;
        const fieldErrors = error?.response?.data?.fieldErrors;
        if (validationErrors && typeof validationErrors === "object") {
            Object.entries(validationErrors).forEach(([field, message]) => {
                this.globalStore.showSnackbar(`${field}: ${message}`, "error");
            });
            return;
        }
        if (fieldErrors && typeof fieldErrors === "object") {
            Object.entries(fieldErrors).forEach(([field, message]) => {
                this.globalStore.showSnackbar(`${field}: ${message}`, "error");
            });
            return;
        }
        const errorMessage = backendMessage || this.formatErrorMessage(error, customMessage);
        console.error(`${this.serviceName} error:`, backendMessage || error);
        this.globalStore.showSnackbar(errorMessage, "error");
    }

    formatErrorMessage(error, customMessage) {
        if (customMessage) return customMessage;

        const statusMessages = {
            400: "Invalid argument: Please check your input",
            401: "Authentication required",
            403: "Access denied",
            404: "Resource not found",
            408: "Request timeout",
            409: "Data integrity violation or resource conflict",
            422: "Validation error",
            429: "Too many requests: Rate limit exceeded",
            500: "Internal server error: An unexpected error occurred",
            502: "Bad gateway: Service temporarily unavailable",
            503: "Service unavailable",
            504: "Gateway timeout"
        };

        if (error.response?.data?.errorType) {
            switch (error.response.data.errorType) {
                case "VALIDATION_ERROR":
                    if (error.response.data.validationErrors) {
                        const errorCount = Object.keys(error.response.data.validationErrors).length;
                        return `Validation failed for ${errorCount} field(s)`;
                    }
                    return "Validation error";
                case "DATA_INTEGRITY_VIOLATION":
                    return error.response.data.message || "Data integrity violation";
                case "INVALID_ARGUMENT":
                    return error.response.data.message || "Invalid argument provided";
                case "NOT_FOUND":
                    return error.response.data.message || "Resource not found";
                case "DUPLICATE_KEY":
                    return error.response.data.message || "Resource already exists";
                case "INTERNAL_SERVER_ERROR":
                    return "An unexpected error occurred";
            }
        }

        if (error.response?.status) {
            return statusMessages[error.response.status] || `${this.serviceName} error: ${error.response.status}`;
        }

        if (error.code === "ECONNABORTED") {
            return "Request timed out. Please try again.";
        }

        if (error.message?.includes("Network Error")) {
            return "Network error. Please check your connection.";
        }

        return error.message || `Error in ${this.serviceName}`;
    }

    async handleRequest(requestFn, options = {}) {
        const { errorMessage = null, responseType = RESPONSE_TYPES.JSON, validate = true, retries = 1 } = options;

        try {
            const response = await this.retryOperation(requestFn, retries);
            return validate ? validateResponse(response, responseType) : response;
        } catch (error) {
            this.handleError(error, errorMessage);
        }
    }

    async retryOperation(operation, maxRetries = DEFAULT_MAX_RETRIES, delay = DEFAULT_RETRY_DELAY) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                if (error.response?.status && !RETRYABLE_STATUS_CODES.includes(error.response.status)) {
                    throw error;
                }
                if (attempt === maxRetries) throw error;

                const retryDelay = delay * attempt;

                console.warn(`Retry attempt ${attempt} after ${retryDelay}ms`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }
    }

    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            return new Promise(resolve => {
                timeout = setTimeout(() => resolve(func(...args)), wait);
            });
        };
    }
}
