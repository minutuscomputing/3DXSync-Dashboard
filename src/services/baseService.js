import ApiService from "./apiService";
import { RESPONSE_TYPES } from "./http/responseTypes";

// Generic base service for CRUD operations
class BaseService {
    constructor(baseUrl) {
        this._baseUrl = baseUrl;
        this._fetchService = ApiService.fetchService;
    }

    _handleRequest(fn, options) {
        return ApiService.handleRequest(fn, options);
    } 
}

export default BaseService;
