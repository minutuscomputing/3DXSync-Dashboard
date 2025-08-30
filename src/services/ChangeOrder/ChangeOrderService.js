 
import BaseService from "@/services/baseService";
import { RESPONSE_TYPES } from "@/services/http/responseTypes";
class ChangeOrderService extends BaseService{

  async fetchImplementedCOs() {
    const rawText = await this._handleRequest(
      () => this._fetchService.get('CO.properties'),
      { responseType: RESPONSE_TYPES.TEXT }
    );
    return rawText
      .trim()
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#') && line.includes('='))
      .map(line => line.split('=')[1].split(';'))
      .filter(parts => parts.length >= 4 && parts[1].toLowerCase() === 'implemented')
      .map(parts => ({
        coNumber: parts[0],      
        status: parts[3],        
        date: parts[2],
        description: parts[4] || '-'
      }));
  }
 
}
 
export default new ChangeOrderService();
 