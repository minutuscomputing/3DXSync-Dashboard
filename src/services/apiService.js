import createAxiosService from "@/utils/httpService";
import { HttpService } from "./http/httpService";

class ApiService extends HttpService {
    constructor() {
        super("ApiService");
        this.fetchService = createAxiosService();
    }
}

export default new ApiService();
