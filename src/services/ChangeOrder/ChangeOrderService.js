import createAxiosService from "@/utils/httpService";
const axiosService = createAxiosService();
export async function fetchImplementedCOs() {
  const response = await axiosService.get('CO.properties',{ responseType: 'text'})
  console.log("response",response)
  let lines = response.trim().split('\n');

  return lines
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#') && line.includes('='))
    .map(line => {
      const value = line.split('=')[1];
      return value.split(';')
    })
    .filter(parts => parts.length >= 3 && parts[1].toLowerCase() === 'implemented')
    .map(parts => ({
      coNumber: parts[0],
      status: parts[1],
      date: parts[2]
    }));
}