import { constant } from '@/constant/constants';
export const RESPONSE_TYPES = {
    JSON: "json",
    TEXT: "text",
    BLOB: "blob",
    ARRAY: "array",
    CSV: "csv"
};

const validateArray = response => {
    if (!Array.isArray(response)) {
        throw new Error("Expected array response but received different type");
    }
    return response;
};

const validateJSON = response => {
    if (!response || typeof response !== "object" || Array.isArray(response)) {
        throw new Error("Invalid JSON response: expected an object");
    }
    return response;
};

const validateText = response => {
    if (typeof response !== constant.STRING) {
        throw new Error("Invalid text response: expected a string");
    }
    return response;
};

const validateCSV = response => {
    if (typeof response !== constant.STRING) {
        throw new Error("Invalid CSV response: expected a string");
    }
    return response;
};

const validateBlob = response => {
    if (!(response instanceof Blob)) {
        throw new Error("Invalid blob response: expected a Blob");
    }
    return response;
};

export const validateResponse = (response, expectedType = RESPONSE_TYPES.JSON) => {
    if (response === undefined || response === null) {
        throw new Error("Empty response received");
    }

    const validators = {
        [RESPONSE_TYPES.JSON]: validateJSON,
        [RESPONSE_TYPES.TEXT]: validateText,
        [RESPONSE_TYPES.BLOB]: validateBlob,
        [RESPONSE_TYPES.ARRAY]: validateArray,
        [RESPONSE_TYPES.CSV]: validateCSV
    };

    const validator = validators[expectedType];
    if (!validator) {
        throw new Error(`Unsupported response type: ${expectedType}`);
    }

    return validator(response);
};
